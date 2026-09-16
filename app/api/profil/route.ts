import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const nama = String(body.nama ?? "").trim();
    const program_studi = String(
      body.program_studi ?? ""
    ).trim();
    const tempat_pkl = String(body.tempat_pkl ?? "").trim();

    if (!nama) {
      return NextResponse.json(
        { error: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        nama,
        program_studi,
        tempat_pkl,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Gagal memperbarui profil:", error);

      return NextResponse.json(
        { error: "Gagal memperbarui profil." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui.",
    });
  } catch (error) {
    console.error("API profil error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}