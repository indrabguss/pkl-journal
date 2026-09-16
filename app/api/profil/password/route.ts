import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currentPassword = String(
      body.current_password ?? ""
    );

    const newPassword = String(body.password ?? "");

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Password saat ini wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password baru minimal 8 karakter.",
        },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          error:
            "Password baru harus berbeda dari password saat ini.",
        },
        { status: 400 }
      );
    }

    // Verifikasi password lama.
    const { error: verifyError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

    if (verifyError) {
      return NextResponse.json(
        {
          error:
            "Password saat ini tidak benar.",
        },
        { status: 400 }
      );
    }

    // Update password baru.
    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {
      console.error(
        "Gagal mengubah password:",
        updateError.message
      );

      return NextResponse.json(
        {
          error:
            "Gagal memperbarui password.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error(
      "API ubah password error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}