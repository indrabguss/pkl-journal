import Link from "next/link";
import { redirect } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AttendanceCard from "@/components/dashboard/AttendanceCard";
import ReportStatistics from "@/components/dashboard/ReportStatistics";

import { createClient } from "@/lib/supabase/server";
import { getProfileWithAvatar } from "@/lib/supabase/profile";

export default async function DashboardPage() {
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
    { data: absensi, error: absensiError },
  ] = await Promise.all([
    getProfileWithAvatar(supabase, user.id),

    supabase
      .from("laporan")
      .select(`
        id,
        tanggal,
        waktu,
        jam_mulai,
        jam_selesai,
        judul,
        aktivitas,
        hasil,
        kendala,
        status,
        created_at,
        dokumentasi (
          id
        )
      `)
      .eq("user_id", user.id)
      .order("tanggal", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("absensi")
      .select(`
        id,
        tanggal,
        waktu_masuk,
        waktu_pulang,
        status
      `)
      .eq("user_id", user.id)
      .order("tanggal", {
        ascending: false,
      }),
  ]);

  if (laporanError) {
    console.error(
      "Gagal mengambil data laporan:",
      laporanError.message
    );
  }

  if (absensiError) {
    console.error(
      "Gagal mengambil data absensi:",
      absensiError.message
    );
  }

  if (!profile) {
    redirect("/profil");
  }

  const reports = laporan ?? [];
  const attendance = absensi ?? [];

  const totalLaporan = reports.length;

  const totalDokumentasi = reports.reduce(
    (total, report) =>
      total +
      (report.dokumentasi?.length ?? 0),
    0
  );

  const totalHadir = attendance.filter(
    (item) =>
      item.status?.toLowerCase() === "hadir"
  ).length;

  const totalDisetujui = reports.filter(
    (report) =>
      report.status === "Disetujui"
  ).length;

  const nama =
    profile.nama ||
    user.email ||
    "Pengguna";

  const recentReports = reports.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#0f1320] text-[#e5e7f0]">
      <DashboardHeader
        nama={nama}
        avatarUrl={avatarUrl}
        active="dashboard"
      />

      <div className="pt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* HERO / WELCOME */}
          <section className="relative overflow-hidden rounded-[32px] border border-[#41434c]/60 bg-[#171b29] px-6 py-8 sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0566d9]/10 blur-3xl" />

            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8190]">
                Personal Internship Journal
              </p>

              <h1 className="mt-2 max-w-3xl font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#e5e7f0] sm:text-4xl">
                Halo, {nama} 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9698a4] sm:text-base">
                Pantau aktivitas PKL, kehadiran,
                dokumentasi, dan perkembangan
                laporan kamu dari satu tempat.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/laporan/buat"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0566d9] px-5 py-3 text-sm font-semibold text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    add
                  </span>
                  Buat Laporan
                </Link>

                <Link
                  href="/laporan"
                  className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-5 py-3 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#303443]"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    description
                  </span>
                  Lihat Laporan
                </Link>
              </div>
            </div>
          </section>

          {/* QUICK STATS */}
          <section className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] border border-[#41434c]/60 bg-[#171b29] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0566d9]/15">
                  <span className="material-symbols-outlined text-[22px] text-[#8fb5ff]">
                    description
                  </span>
                </div>

                <p className="mt-5 text-sm text-[#92949f]">
                  Total Laporan
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#ebedf5]">
                    {totalLaporan}
                  </span>

                  <span className="text-xs text-[#858793]">
                    laporan
                  </span>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#41434c]/60 bg-[#171b29] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0566d9]/15">
                  <span className="material-symbols-outlined text-[22px] text-[#8fb5ff]">
                    event_available
                  </span>
                </div>

                <p className="mt-5 text-sm text-[#92949f]">
                  Hari Hadir
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#ebedf5]">
                    {totalHadir}
                  </span>

                  <span className="text-xs text-[#858793]">
                    hari
                  </span>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#41434c]/60 bg-[#171b29] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0566d9]/15">
                  <span className="material-symbols-outlined text-[22px] text-[#8fb5ff]">
                    check_circle
                  </span>
                </div>

                <p className="mt-5 text-sm text-[#92949f]">
                  Disetujui
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#ebedf5]">
                    {totalDisetujui}
                  </span>

                  <span className="text-xs text-[#858793]">
                    laporan
                  </span>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#41434c]/60 bg-[#171b29] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0566d9]/15">
                  <span className="material-symbols-outlined text-[22px] text-[#8fb5ff]">
                    photo_library
                  </span>
                </div>

                <p className="mt-5 text-sm text-[#92949f]">
                  Dokumentasi
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#ebedf5]">
                    {totalDokumentasi}
                  </span>

                  <span className="text-xs text-[#858793]">
                    foto
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ABSENSI */}
          <AttendanceCard />

          {/* REKAP & STATISTIK */}
          <ReportStatistics
            reports={reports}
            attendance={attendance}
          />

          {/* LAPORAN TERBARU */}
          <section className="mt-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#81838f]">
                  Aktivitas
                </p>

                <h2 className="mt-1 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-[#e5e7f0]">
                  Laporan Terbaru
                </h2>
              </div>

              <Link
                href="/laporan"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#8fb5ff] transition hover:text-[#adc6ff]"
              >
                Lihat semua
                <span className="material-symbols-outlined text-[17px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            {recentReports.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#41434c] bg-[#171b29] px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0566d9]/10">
                  <span className="material-symbols-outlined text-[24px] text-[#727582]">
                    description
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#dfe1f5]">
                  Belum ada laporan
                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#7f8190]">
                  Mulai dokumentasikan kegiatan
                  PKL kamu dengan membuat
                  laporan pertama.
                </p>

                <Link
                  href="/laporan/buat"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0566d9] px-5 py-2.5 text-sm font-medium text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                  Buat Laporan
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/laporan/${report.id}`}
                    className="group block rounded-[24px] border border-[#41434c]/60 bg-[#171b29] p-5 transition hover:border-[#5b5e69] hover:bg-[#1a1f2e]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#0566d9]/10 px-3 py-1 text-[11px] font-medium text-[#8fb5ff]">
                            {report.status || "Draft"}
                          </span>

                          <span className="text-xs text-[#70727e]">
                            {new Intl.DateTimeFormat(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            ).format(
                              new Date(
                                `${report.tanggal}T00:00:00`
                              )
                            )}
                          </span>
                        </div>

                        <h3 className="mt-3 truncate text-base font-semibold text-[#dfe1f5] group-hover:text-[#edf0ff]">
                          {report.judul ||
                            "Laporan kegiatan"}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#858793]">
                          {report.aktivitas ||
                            "Tidak ada deskripsi aktivitas."}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="hidden items-center gap-1.5 text-xs text-[#777985] sm:flex">
                          <span className="material-symbols-outlined text-[17px]">
                            photo_library
                          </span>
                          {
                            report.dokumentasi
                              ?.length ?? 0
                          }
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#252938] text-[#9295a2] transition group-hover:bg-[#0566d9]/15 group-hover:text-[#8fb5ff]">
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <footer className="border-t border-[#363844]/50 px-4 py-8 text-center text-xs text-[#737581] sm:px-6">
        © 2026 PKL Journal
      </footer>
    </main>
  );
}