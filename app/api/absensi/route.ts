import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const { data: absensi, error } = await supabase
    .from("absensi")
    .select(
      "id, user_id, tanggal, waktu_masuk, waktu_pulang, status"
    )
    .eq("user_id", user.id)
    .eq(
      "tanggal",
      new Date().toISOString().slice(0, 10)
    )
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    absensi: absensi ?? null,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const action = body?.action;

  if (action !== "masuk" && action !== "pulang") {
    return NextResponse.json(
      { error: "Aksi absensi tidak valid." },
      { status: 400 }
    );
  }

  const { data: existing, error: findError } =
    await supabase
      .from("absensi")
      .select(
        "id, tanggal, waktu_masuk, waktu_pulang, status"
      )
      .eq("user_id", user.id)
      .eq(
        "tanggal",
        new Date().toISOString().slice(0, 10)
      )
      .maybeSingle();

  if (findError) {
    return NextResponse.json(
      { error: findError.message },
      { status: 500 }
    );
  }

  if (action === "masuk") {
    if (existing?.waktu_masuk) {
      return NextResponse.json(
        {
          error: "Kamu sudah melakukan absen masuk hari ini.",
        },
        { status: 400 }
      );
    }

    if (existing) {
      const { data: updated, error: updateError } =
        await supabase
          .from("absensi")
          .update({
            waktu_masuk: new Date().toISOString(),
            status: "Hadir",
          })
          .eq("id", existing.id)
          .eq("user_id", user.id)
          .select(
            "id, user_id, tanggal, waktu_masuk, waktu_pulang, status"
          )
          .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        absensi: updated,
      });
    }

    const { data: created, error: insertError } =
      await supabase
        .from("absensi")
        .insert({
          user_id: user.id,
          tanggal: new Date()
            .toISOString()
            .slice(0, 10),
          waktu_masuk: new Date().toISOString(),
          status: "Hadir",
        })
        .select(
          "id, user_id, tanggal, waktu_masuk, waktu_pulang, status"
        )
        .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      absensi: created,
    });
  }

  if (!existing?.waktu_masuk) {
    return NextResponse.json(
      {
        error:
          "Kamu harus melakukan absen masuk terlebih dahulu.",
      },
      { status: 400 }
    );
  }

  if (existing.waktu_pulang) {
    return NextResponse.json(
      {
        error: "Kamu sudah melakukan absen pulang hari ini.",
      },
      { status: 400 }
    );
  }

  const { data: updated, error: updateError } =
    await supabase
      .from("absensi")
      .update({
        waktu_pulang: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .eq("user_id", user.id)
      .select(
        "id, user_id, tanggal, waktu_masuk, waktu_pulang, status"
      )
      .single();

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    absensi: updated,
  });
}