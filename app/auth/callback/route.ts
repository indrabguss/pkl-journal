import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest
) {
  const url = new URL(request.url);

  const code =
    url.searchParams.get("code");

  const tokenHash =
    url.searchParams.get("token_hash");

  const type =
    url.searchParams.get("type") as
      | EmailOtpType
      | null;

  const requestedNext =
    url.searchParams.get("next") ??
    "/dashboard";

  /*
   * Hanya izinkan internal path.
   * Mencegah redirect ke domain eksternal.
   */
  const next =
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//")
      ? requestedNext
      : "/dashboard";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL
      ?.trim()
      .replace(/\/+$/, "");

  if (!siteUrl) {
    console.error(
      "NEXT_PUBLIC_SITE_URL belum dikonfigurasi."
    );

    return NextResponse.redirect(
      new URL(
        "/verifikasi-gagal",
        request.url
      )
    );
  }

  const supabase =
    await createClient();

  /*
   * ========================================
   * AUTHORIZATION CODE / PKCE
   * ========================================
   *
   * Digunakan oleh:
   * - Password recovery
   * - OAuth
   * - Flow lain yang menghasilkan ?code=
   *
   * Code ditukar menjadi session.
   */
  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code
      );

    if (error) {
      console.error(
        "Gagal menukar auth code:",
        error.message
      );

      return NextResponse.redirect(
        new URL(
          "/verifikasi-gagal",
          siteUrl
        )
      );
    }

    return NextResponse.redirect(
      new URL(
        next,
        siteUrl
      )
    );
  }

  /*
   * ========================================
   * EMAIL OTP / TOKEN HASH
   * ========================================
   *
   * Digunakan oleh flow verifikasi email
   * yang menggunakan token_hash.
   */
  if (tokenHash && type) {
    const { error } =
      await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });

    if (error) {
      console.error(
        "Gagal verifikasi OTP:",
        error.message
      );

      return NextResponse.redirect(
        new URL(
          "/verifikasi-gagal",
          siteUrl
        )
      );
    }

    return NextResponse.redirect(
      new URL(
        next,
        siteUrl
      )
    );
  }

  console.error(
    "Callback auth tidak memiliki code atau token_hash."
  );

  return NextResponse.redirect(
    new URL(
      "/verifikasi-gagal",
      siteUrl
    )
  );
}

