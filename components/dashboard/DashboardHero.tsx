import Link from "next/link";

function AddCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden bg-[#090e1b] py-16 sm:py-20">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#0566d9]/20 blur-3xl" />

      <div className="pointer-events-none absolute right-[-8rem] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#0f0030]/50 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-8 px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-4 py-1.5">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#adc6ff]" />

          <span className="text-xs font-medium text-[#d8e2ff]">
            PKL sedang berlangsung
          </span>
        </div>

        <div className="flex max-w-4xl flex-col gap-4">
          <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold leading-tight tracking-tight text-[#dfe1f5] sm:text-5xl lg:text-6xl">
            Dokumentasikan setiap hari perjalanan PKL kamu.
          </h1>

          <p className="max-w-2xl text-base leading-6 text-[#c7c6cb] sm:text-lg">
            Catat apa yang kamu kerjakan, simpan dokumentasinya, dan lihat
            perkembangan perjalanan PKL kamu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/laporan/buat"
            className="group inline-flex items-center gap-2 rounded-full bg-[#0566d9] px-6 py-3.5 text-sm font-medium text-[#e6ecff] shadow-md transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
          >
            <span className="transition-transform duration-300 group-hover:rotate-90">
              <AddCircleIcon />
            </span>

            Buat Laporan Hari Ini
          </Link>

          <Link
            href="/laporan"
            className="inline-flex items-center gap-2 rounded-full bg-[#1b1f2d] px-6 py-3.5 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#252938]"
          >
            Lihat Semua Laporan
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}