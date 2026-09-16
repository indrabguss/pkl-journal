import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const requestedNext = url.searchParams.get("next") ?? "/dashboard";

  const next =
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//")
      ? requestedNext
      : "/dashboard";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  if (!siteUrl) {
    return NextResponse.redirect(
      new URL("/verifikasi-gagal", request.url)
    );
  }

  const supabase = await createClient();

  // Flow OAuth / PKCE / recovery dengan authorization code
  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        "Gagal menukar auth code:",
        error.message
      );

      return NextResponse.redirect(
        new URL("/verifikasi-gagal", siteUrl)
      );
    }

    return NextResponse.redirect(
      new URL(next, siteUrl)
    );
  }

  // Flow email OTP / token hash
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      console.error(
        "Gagal verifikasi OTP:",
        error.message
      );

      return NextResponse.redirect(
        new URL("/verifikasi-gagal", siteUrl)
      );
    }

    return NextResponse.redirect(
      new URL(next, siteUrl)
    );
  }

  return NextResponse.redirect(
    new URL("/verifikasi-gagal", siteUrl)
  );
}