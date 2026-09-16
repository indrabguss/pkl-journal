function DescriptionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 3h9l3 3v15H6V3Z" />
      <path d="M14 3v4h4M9 11h6M9 15h6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4M17 3v4M3 10h18M8 15h3M8 18h3" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 17 10 11l4 4 6-8" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

type DashboardStatsProps = {
  totalLaporan: number;
  hariTercatat: number;
  progress: number;
};

function StatCard({
  label,
  value,
  suffix,
  description,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#1b1f2d] p-6 transition-colors hover:bg-[#252938]">
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#c7c6cd]/5 blur-xl transition group-hover:bg-[#adc6ff]/10" />

      <div className="mb-8 flex items-center justify-between">
        <span className="text-sm text-[#c7c6cb]">
          {label}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#090e1b] text-[#adc6ff]">
          {icon}
        </div>
      </div>

      <div>
        <div className="font-[family-name:var(--font-syne)] text-4xl font-bold text-[#dfe1f5]">
          {value}

          {suffix && (
            <span className="ml-1 text-2xl text-[#c7c6cb]">
              {suffix}
            </span>
          )}
        </div>

        <p className="mt-2 text-xs leading-5 text-[#c7c6cb]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function DashboardStats({
  totalLaporan,
  hariTercatat,
  progress,
}: DashboardStatsProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <section className="w-full bg-[#171b29] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-[#c7c6cb]">
              Statistik Magang
            </span>

            <h2 className="mt-1 font-[family-name:var(--font-syne)] text-3xl font-bold text-[#dfe1f5]">
              Aktivitas PKL
            </h2>
          </div>

          <div className="text-sm text-[#c7c6cb]">
            Data laporan tersimpan di PKL Journal
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Laporan"
            value={String(totalLaporan)}
            description="Total laporan yang sudah dibuat"
            icon={<DescriptionIcon />}
          />

          <StatCard
            label="Hari Tercatat"
            value={String(hariTercatat)}
            suffix=" Hari"
            description="Jumlah hari yang memiliki laporan"
            icon={<CalendarIcon />}
          />

          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#1b1f2d] p-6 transition-colors hover:bg-[#252938]">
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#c7c6cd]/5 blur-xl transition group-hover:bg-[#adc6ff]/10" />

            <div className="mb-8 flex items-center justify-between">
              <span className="text-sm text-[#c7c6cb]">
                Progress Laporan
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#090e1b] text-[#adc6ff]">
                <TrendIcon />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-[family-name:var(--font-syne)] text-4xl font-bold text-[#dfe1f5]">
                  {safeProgress}%
                </span>

                <span className="text-xs text-[#c7c6cb]">
                  Berdasarkan aktivitas
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-[#090e1b]">
                <div
                  className="h-full rounded-full bg-[#adc6ff] transition-all duration-300"
                  style={{ width: `${safeProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}