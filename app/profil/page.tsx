import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfilPageContent from "@/components/profil/ProfilPageContent";

export default async function ProfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { data: laporan },
    { data: absensi },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "nama, email, id_praktikan, program_studi, tempat_pkl, avatar_path, created_at"
      )
      .eq("id", user.id)
      .single(),

    supabase
      .from("laporan")
      .select(`
        id,
        dokumentasi (
          id
        )
      `)
      .eq("user_id", user.id),

    supabase
      .from("absensi")
      .select("tanggal, status")
      .eq("user_id", user.id),
  ]);

  if (!profile) {
    redirect("/dashboard");
  }

  const totalLaporan = laporan?.length ?? 0;

  const totalDokumentasi =
    laporan?.reduce(
      (total, report) =>
        total + (report.dokumentasi?.length ?? 0),
      0
    ) ?? 0;

  const totalHariAbsensi =
    absensi?.filter(
      (item) => item.status === "Hadir"
    ).length ?? 0;

  let avatarUrl = "";

  if (profile.avatar_path) {
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("avatars")
        .createSignedUrl(
          profile.avatar_path,
          60 * 60
        );

    if (signedUrlError) {
      console.error(
        "Gagal membuat signed URL avatar:",
        signedUrlError.message
      );
    } else {
      avatarUrl =
        signedUrlData?.signedUrl ?? "";
    }
  }

  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <DashboardHeader
        nama={profile.nama || user.email || "Pengguna"}
        avatarUrl={avatarUrl}
        active="profil"
      />

      <div className="pt-16">
        <ProfilPageContent
          profile={profile}
          userEmail={user.email ?? ""}
          totalLaporan={totalLaporan}
          totalDokumentasi={totalDokumentasi}
          totalHariAbsensi={totalHariAbsensi}
          avatarUrl={avatarUrl}
        />
      </div>

      <footer className="bg-[#171b29] px-6 py-8 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved.
        Platform Praktik Kerja Lapangan. By
        NgussDeveloper.
      </footer>
    </main>
  );
}