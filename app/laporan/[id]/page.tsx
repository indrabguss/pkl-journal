import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getProfileWithAvatar } from "@/lib/supabase/profile";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DetailLaporan from "@/components/laporan/detail/DetailLaporan";

type DetailLaporanPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetailLaporanPage({
  params,
}: DetailLaporanPageProps) {
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

  const { data: dokumentasi } = await supabase
    .from("dokumentasi")
    .select(
      "id, laporan_id, file_path, nama_file, created_at"
    )
    .eq("laporan_id", laporan.id)
    .order("created_at", {
      ascending: true,
    });

  const documentationWithUrls =
    await Promise.all(
      (dokumentasi ?? []).map(async (file) => {
        const { data } = await supabase.storage
          .from("dokumentasi")
          .createSignedUrl(
            file.file_path,
            60 * 10
          );

        return {
          ...file,
          url: data?.signedUrl ?? null,
        };
      })
    );

  return (
    <main className="min-h-screen bg-[#0f1320]">
      <DashboardHeader
        nama={
          profile?.nama ??
          user.email ??
          "Pengguna"
        }
        avatarUrl={avatarUrl}
        active="laporan"
      />

      <section className="pt-16">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <DetailLaporan
            laporan={laporan}
            dokumentasi={documentationWithUrls}
          />
        </div>
      </section>
    </main>
  );
}