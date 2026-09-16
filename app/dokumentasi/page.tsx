import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getProfileWithAvatar } from "@/lib/supabase/profile";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DokumentasiPageContent from "@/components/dokumentasi/DokumentasiPageContent";

type DokumentasiRow = {
  id: string;
  laporan_id: string;
  file_path: string;
  nama_file: string;
  created_at: string;
};

type LaporanRow = {
  id: string;
  tanggal: string;
  judul: string;
  aktivitas: string;
  created_at: string;
  dokumentasi: DokumentasiRow[];
};

export default async function DokumentasiPage() {
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
        `
        id,
        tanggal,
        judul,
        aktivitas,
        created_at,
        dokumentasi (
          id,
          laporan_id,
          file_path,
          nama_file,
          created_at
        )
        `
      )
      .eq("user_id", user.id)
      .order("tanggal", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (laporanError) {
    console.error(
      "Gagal mengambil dokumentasi:",
      laporanError.message
    );
  }

  const reports = (laporan ?? []) as LaporanRow[];

  const documentation = (
    await Promise.all(
      reports.flatMap((report) =>
        report.dokumentasi.map(async (doc) => {
          const {
            data: signedUrlData,
            error: signedUrlError,
          } = await supabase.storage
            .from("dokumentasi")
            .createSignedUrl(
              doc.file_path,
              60 * 60
            );

          if (
            signedUrlError ||
            !signedUrlData?.signedUrl
          ) {
            console.error(
              `Gagal membuat signed URL ${doc.nama_file}:`,
              signedUrlError?.message
            );

            return null;
          }

          return {
            id: doc.id,
            laporanId: report.id,
            tanggal: report.tanggal,
            judul: report.judul,
            aktivitas: report.aktivitas,
            namaFile: doc.nama_file,
            filePath: doc.file_path,
            createdAt: doc.created_at,
            signedUrl: signedUrlData.signedUrl,
          };
        })
      )
    )
  ).filter(
    (
      item
    ): item is NonNullable<typeof item> =>
      item !== null
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
        active="dokumentasi"
      />

      <div className="pt-16">
        <DokumentasiPageContent
          documentation={documentation}
        />
      </div>

      <footer className="bg-[#171b29] px-6 py-8 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved.
        Platform Praktik Kerja Lapangan. By NgussDeveloper
      </footer>
    </main>
  );
}