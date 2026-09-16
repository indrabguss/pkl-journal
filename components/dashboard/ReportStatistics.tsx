"use client";

import { useMemo } from "react";

type Report = {
  id: string | number;
  tanggal: string;
  jam_mulai?: string | null;
  jam_selesai?: string | null;
  status?: string | null;
  dokumentasi?: {
    id: string | number;
  }[];
};

type Attendance = {
  tanggal: string;
  status?: string | null;
};

type ReportStatisticsProps = {
  reports: Report[];
  attendance: Attendance[];
};

const STATUS_ITEMS = [
  {
    label: "Draft",
    icon: "edit_note",
  },
  {
    label: "Terkirim",
    icon: "send",
  },
  {
    label: "Diajukan",
    icon: "pending_actions",
  },
  {
    label: "Disetujui",
    icon: "check_circle",
  },
  {
    label: "Ditolak",
    icon: "cancel",
  },
];

function parseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function calculateDuration(
  start?: string | null,
  end?: string | null
) {
  if (!start || !end) {
    return 0;
  }

  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);

  if (
    startMinutes === null ||
    endMinutes === null
  ) {
    return 0;
  }

  let duration =
    endMinutes - startMinutes;

  if (duration < 0) {
    duration += 24 * 60;
  }

  return duration;
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(
    totalMinutes / 60
  );

  const minutes =
    totalMinutes % 60;

  if (
    hours === 0 &&
    minutes === 0
  ) {
    return "0j";
  }

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}j`;
  }

  return `${hours}j ${minutes}m`;
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getMonthName(date: Date) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      month: "short",
    }
  ).format(date);
}

export default function ReportStatistics({
  reports,
  attendance,
}: ReportStatisticsProps) {
  const statistics = useMemo(() => {
    const totalReports =
      reports.length;

    const totalDocumentation =
      reports.reduce(
        (total, report) =>
          total +
          (report.dokumentasi?.length ??
            0),
        0
      );

    const totalMinutes =
      reports.reduce(
        (total, report) =>
          total +
          calculateDuration(
            report.jam_mulai,
            report.jam_selesai
          ),
        0
      );

    const hadirDays =
      attendance.filter(
        (item) =>
          item.status?.toLowerCase() ===
          "hadir"
      ).length;

    const statusCounts: Record<
      string,
      number
    > = {};

    STATUS_ITEMS.forEach((item) => {
      statusCounts[item.label] =
        reports.filter(
          (report) =>
            report.status ===
            item.label
        ).length;
    });

    /*
     * Enam bulan terakhir.
     */
    const now = new Date();

    const months = Array.from(
      {
        length: 6,
      },
      (_, index) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() -
            (5 - index),
          1
        );

        const key =
          getMonthKey(date);

        const count =
          reports.filter(
            (report) => {
              if (!report.tanggal) {
                return false;
              }

              const reportDate =
                new Date(
                  `${report.tanggal}T00:00:00`
                );

              return (
                getMonthKey(
                  reportDate
                ) === key
              );
            }
          ).length;

        return {
          key,
          label:
            getMonthName(date),
          count,
        };
      }
    );

    const maxMonthlyCount =
      Math.max(
        ...months.map(
          (item) =>
            item.count
        ),
        1
      );

    return {
      totalReports,
      totalDocumentation,
      totalMinutes,
      hadirDays,
      statusCounts,
      months,
      maxMonthlyCount,
    };
  }, [reports, attendance]);

  const statCards = [
    {
      label: "Total Laporan",
      value:
        statistics.totalReports,
      suffix: "laporan",
      icon: "description",
    },
    {
      label: "Hari Hadir",
      value:
        statistics.hadirDays,
      suffix: "hari",
      icon: "event_available",
    },
    {
      label: "Total Waktu",
      value: formatDuration(
        statistics.totalMinutes
      ),
      suffix: "",
      icon: "schedule",
    },
    {
      label: "Dokumentasi",
      value:
        statistics.totalDocumentation,
      suffix: "foto",
      icon: "photo_library",
    },
  ];

  return (
    <section className="mt-8">
      {/* SECTION HEADER */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#81838f]">
          Ringkasan
        </p>

        <div className="mt-1">
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-[#e5e7f0]">
            Rekap PKL
          </h2>

          <p className="mt-1 text-sm text-[#898b97]">
            Ringkasan aktivitas
            internship kamu.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="group rounded-[24px] border border-[#41434c]/60 bg-[#171b29] p-5 transition hover:-translate-y-0.5 hover:border-[#555864]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0566d9]/15">
                <span className="material-symbols-outlined text-[22px] text-[#8fb5ff]">
                  {card.icon}
                </span>
              </div>

              <span className="material-symbols-outlined text-[18px] text-[#525560]">
                insights
              </span>
            </div>

            <div className="mt-5">
              <p className="text-sm text-[#92949f]">
                {card.label}
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-syne)] text-[30px] font-bold tracking-tight text-[#ebedf5]">
                  {card.value}
                </span>

                {card.suffix && (
                  <span className="text-xs text-[#858793]">
                    {card.suffix}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART + STATUS */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        {/* MONTHLY CHART */}
        <div className="rounded-[28px] border border-[#41434c]/60 bg-[#171b29] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-[#e2e4ee]">
                Aktivitas Laporan
              </p>

              <p className="mt-1 text-xs text-[#858792]">
                Jumlah laporan selama
                6 bulan terakhir
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0566d9]/15">
              <span className="material-symbols-outlined text-[19px] text-[#8fb5ff]">
                bar_chart
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-[230px] items-end gap-2 sm:gap-4">
              {statistics.months.map(
                (month) => {
                  const height =
                    month.count ===
                    0
                      ? 10
                      : Math.max(
                          24,
                          Math.round(
                            (month.count /
                              statistics.maxMonthlyCount) *
                              180
                          )
                        );

                  return (
                    <div
                      key={month.key}
                      className="flex min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-2 text-xs font-semibold text-[#bfc1cc]">
                        {month.count}
                      </span>

                      <div
                        className="w-full max-w-14 rounded-t-[16px] bg-[#0566d9]"
                        style={{
                          height: `${height}px`,
                          opacity:
                            month.count ===
                            0
                              ? 0.22
                              : 1,
                        }}
                      />

                      <span className="mt-3 text-[11px] font-medium text-[#777985]">
                        {month.label}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="rounded-[28px] border border-[#41434c]/60 bg-[#171b29] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-[#e2e4ee]">
                Status Laporan
              </p>

              <p className="mt-1 text-xs text-[#858792]">
                Distribusi status
                laporan kamu.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0566d9]/15">
              <span className="material-symbols-outlined text-[19px] text-[#8fb5ff]">
                pie_chart
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {STATUS_ITEMS.map(
              (item) => {
                const count =
                  statistics
                    .statusCounts[
                    item.label
                  ] ?? 0;

                const percentage =
                  statistics.totalReports ===
                  0
                    ? 0
                    : Math.round(
                        (count /
                          statistics.totalReports) *
                          100
                      );

                return (
                  <div
                    key={item.label}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="material-symbols-outlined text-[17px] text-[#7f8190]">
                          {
                            item.icon
                          }
                        </span>

                        <span className="truncate text-sm text-[#bfc1cc]">
                          {
                            item.label
                          }
                        </span>
                      </div>

                      <span className="shrink-0 text-xs text-[#858793]">
                        {count} ·{" "}
                        {percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#282c39]">
                      <div
                        className="h-full rounded-full bg-[#0566d9] transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* EMPTY STATE */}
          {statistics.totalReports ===
            0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-[#41434c] bg-[#141824] px-4 py-5 text-center">
              <span className="material-symbols-outlined text-[24px] text-[#686b78]">
                analytics
              </span>

              <p className="mt-2 text-sm font-medium text-[#bfc1cc]">
                Belum ada data
                laporan
              </p>

              <p className="mt-1 text-xs text-[#787a86]">
                Statistik akan
                muncul setelah
                kamu membuat
                laporan.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}