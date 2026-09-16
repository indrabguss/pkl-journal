import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
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

  if (!code) {
    return NextResponse.redirect(
      new URL("/verifikasi-gagal", siteUrl)
    );
  }

  const supabase = await createClient();

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