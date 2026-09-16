import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getProfileWithAvatar } from "@/lib/supabase/profile";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BuatLaporanForm from "@/components/laporan/BuatLaporanForm";

export default async function BuatLaporanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { profile, avatarUrl } =
    await getProfileWithAvatar(
      supabase,
      user.id
    );

  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <DashboardHeader
        nama={
          profile?.nama ??
          user.email ??
          "Pengguna"
        }
        avatarUrl={avatarUrl}
        active="laporan"
      />

      <div className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#171b29] px-6 py-12 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#adc6ff]/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#d0bcff]/10 blur-3xl" />

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#adc6ff]">
              <span className="material-symbols-outlined text-[18px]">
                edit_note
              </span>

              <span>Jurnal Harian PKL</span>
            </div>

            <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight text-[#dfe1f5] sm:text-5xl">
              Apa yang kamu kerjakan hari ini?
            </h1>

            <p className="max-w-xl text-base leading-6 text-[#c7c6cb]">
              Catat aktivitas PKL kamu sebelum harinya
              berlalu.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-6 py-12 lg:py-16">
          <BuatLaporanForm />
        </section>
      </div>

      <footer className="bg-[#171b29] px-6 py-8 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved.
        Platform Praktik Kerja Lapangan. By NgussDeveloper
      </footer>
    </main>
  );
}