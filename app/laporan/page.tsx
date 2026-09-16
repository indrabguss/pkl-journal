import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getProfileWithAvatar } from "@/lib/supabase/profile";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LaporanPageContent from "@/components/laporan/LaporanPageContent";

export default async function LaporanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { profile, avatarUrl },
    { data: laporan, error: laporanError },
  ] = await Promise.all([
    getProfileWithAvatar(supabase, user.id),

    supabase
      .from("laporan")
      .select(
        "id, tanggal, judul, aktivitas, status, created_at"
      )
      .eq("user_id", user.id)
      .order("tanggal", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (laporanError) {
    console.error(
      "Gagal mengambil laporan:",
      laporanError.message
    );
  }

  const reports = laporan ?? [];

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
        <LaporanPageContent
          reports={reports}
          profile={profile ?? {}}
        />
      </div>

      <footer className="bg-[#171b29] px-6 py-8 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved.
        Platform Praktik Kerja Lapangan. By NgussDeveloper
      </footer>
    </main>
  );
}