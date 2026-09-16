import Link from "next/link";

type Report = {
  id: string;
  tanggal: string;
  waktu: string | null;
  judul: string;
  status: string;
};

type RecentReportsProps = {
  reports: Report[];
};

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getStatusClass(status: string) {
  switch (status) {
    case "Disetujui":
      return "bg-[#0566d9]/30 text-[#adc6ff]";

    case "Diajukan":
      return "bg-[#d0bcff]/20 text-[#d0bcff]";

    case "Ditolak":
      return "bg-[#93000a]/20 text-[#ffb4ab]";

    default:
      return "bg-[#303443] text-[#c7c6cb]";
  }
}

export default function RecentReports({
  reports,
}: RecentReportsProps) {
  return (
    <section className="w-full bg-[#171b29] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-[#c7c6cb]">
              Aktivitas Terkini
            </span>

            <h2 className="mt-1 font-[family-name:var(--font-syne)] text-3xl font-bold text-[#dfe1f5]">
              Laporan Terbaru
            </h2>
          </div>

          <Link
            href="/laporan"
            className="hidden items-center gap-1 text-sm font-medium text-[#adc6ff] hover:underline sm:inline-flex"
          >
            Semua Laporan
            <span>→</span>
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="rounded-[2rem] bg-[#1b1f2d] p-8 text-center">
            <p className="text-sm text-[#c7c6cb]">
              Belum ada laporan. Yuk mulai catat kegiatan PKL kamu hari ini.
            </p>

            <Link
              href="/laporan/buat"
              className="mt-4 inline-flex rounded-full bg-[#0566d9] px-5 py-3 text-sm font-medium text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
            >
              Buat Laporan
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-[#1b1f2d] p-4 transition hover:bg-[#252938] sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#090e1b] text-[#adc6ff]">
                    <CheckIcon />
                  </div>

                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-[#adc6ff]">
                        {formatDate(report.tanggal)}
                      </span>

                      {report.waktu && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-[#919095]" />

                          <span className="text-xs text-[#c7c6cb]">
                            {report.waktu.slice(0, 5)}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-[family-name:var(--font-syne)] text-base font-semibold text-[#dfe1f5] sm:text-lg">
                      {report.judul}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-medium ${getStatusClass(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>

                  <Link
                    href={`/laporan/${report.id}`}
                    aria-label={`Lihat ${report.judul}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#090e1b] text-[#dfe1f5] transition hover:bg-[#0f1320]"
                  >
                    <EyeIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}