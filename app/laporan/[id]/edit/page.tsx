import { notFound, redirect } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EditLaporanForm from "@/components/laporan/EditLaporanForm";
import { createClient } from "@/lib/supabase/server";
import { getProfileWithAvatar } from "@/lib/supabase/profile";

type EditLaporanPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLaporanPage({
  params,
}: EditLaporanPageProps) {
  const { id } = await params;

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
        user_id,
        tanggal,
        waktu,
        jam_mulai,
        jam_selesai,
        judul,
        aktivitas,
        hasil,
        kendala,
        status,
        created_at
        `
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
  ]);

  if (laporanError || !laporan) {
    notFound();
  }

  const {
    data: dokumentasi,
    error: dokumentasiError,
  } = await supabase
    .from("dokumentasi")
    .select(
      "id, laporan_id, file_path, nama_file, created_at"
    )
    .eq("laporan_id", laporan.id)
    .order("created_at", {
      ascending: true,
    });

  if (dokumentasiError) {
    console.error(
      "Gagal mengambil dokumentasi:",
      dokumentasiError.message
    );
  }

  const dokumentasiWithUrls = await Promise.all(
    (dokumentasi ?? []).map(async (file) => {
      const { data, error } =
        await supabase.storage
          .from("dokumentasi")
          .createSignedUrl(
            file.file_path,
            60 * 10
          );

      if (error) {
        console.error(
          `Gagal membuat signed URL ${file.nama_file}:`,
          error.message
        );
      }

      return {
        ...file,
        url: data?.signedUrl ?? null,
      };
    })
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
        <EditLaporanForm
          laporan={laporan}
          dokumentasi={dokumentasiWithUrls}
        />
      </div>

      <footer className="bg-[#171b29] px-6 py-8 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved.
        Platform Praktik Kerja Lapangan. By
        NgussDeveloper
      </footer>
    </main>
  );
}