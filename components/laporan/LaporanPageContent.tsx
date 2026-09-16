import ExportLaporanMingguanButton from "@/components/laporan/ExportLaporanMingguanButton";
import LaporanList from "@/components/laporan/LaporanList";

type Report = {
  id: string;
  tanggal: string;
  judul: string;
  aktivitas: string;
  status: string;
  created_at: string;
};

type Profile = {
  nama?: string | null;
  email?: string | null;
  id_praktikan?: string | null;
  program_studi?: string | null;
  tempat_pkl?: string | null;
};

type LaporanPageContentProps = {
  reports: Report[];
  profile: Profile;
};

export default function LaporanPageContent({
  reports,
  profile,
}: LaporanPageContentProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#adc6ff]">
            ARSIP JURNAL
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
            Laporan Harian
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#8d8f98]">
            Kelola laporan kegiatan PKL dan export aktivitas
            mingguan dalam format yang siap dicetak.
          </p>
        </div>

        <ExportLaporanMingguanButton
          reports={reports}
          profile={profile}
        />
      </div>

      <LaporanList reports={reports} />
    </div>
  );
}