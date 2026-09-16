import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
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
          "Laporan yang sudah terkirim tidak dapat dihapus.",
      },
      { status: 400 }
    );
  }

  const { data: files, error: filesError } = await supabase
    .from("dokumentasi")
    .select("id, file_path")
    .eq("laporan_id", id);

  if (filesError) {
    return NextResponse.json(
      { error: filesError.message },
      { status: 500 }
    );
  }

  if (files && files.length > 0) {
    const filePaths = files.map((file) => file.file_path);

    const { error: storageError } = await supabase.storage
      .from("dokumentasi")
      .remove(filePaths);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }
  }

  const { error: documentationDeleteError } = await supabase
    .from("dokumentasi")
    .delete()
    .eq("laporan_id", id);

  if (documentationDeleteError) {
    return NextResponse.json(
      { error: documentationDeleteError.message },
      { status: 500 }
    );
  }

  const { error: deleteError } = await supabase
    .from("laporan")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}