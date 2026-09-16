import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
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

  const { data: laporan, error: findError } = await supabase
    .from("laporan")
    .select("id, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (findError || !laporan) {
    return NextResponse.json(
      { error: "Laporan tidak ditemukan." },
      { status: 404 }
    );
  }

  if (laporan.status !== "Draft") {
    return NextResponse.json(
      {
        error:
          "Hanya laporan dengan status Draft yang dapat dikirim.",
      },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase
    .from("laporan")
    .update({
      status: "Terkirim",
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}