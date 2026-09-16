import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const requestedNext = url.searchParams.get("next") ?? "/verifikasi";

  const next =
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//")
      ? requestedNext
      : "/verifikasi";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?.trim()
    .replace(/\/+$/, "");

  if (!siteUrl) {
    return NextResponse.redirect(
      new URL("/verifikasi-gagal", request.url)
    );
  }

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      new URL("/verifikasi-gagal", siteUrl)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    console.error(
      "Gagal verifikasi email:",
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