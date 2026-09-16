"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type Report = {
  id: string;
  tanggal: string;
  waktu?: string | null;
  jam_mulai?: string | null;
  jam_selesai?: string | null;
  judul: string;
  aktivitas: string;
  status: string;
  created_at: string;
};

type KalenderPageContentProps = {
  reports: Report[];
};

type CalendarCell = {
  date: Date;
  currentMonth: boolean;
};

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
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
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M16 2v4M8 2v4M3 9h18" />
    </svg>
  );
}

function EventIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M16 2v4M8 2v4M3 9h18" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatSelectedDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value?: string | null) {
  return value ? value.slice(0, 5) : "--:--";
}

function createDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateOnly(value: string) {
  return new Date(`${value}T00:00:00`);
}

function sameDate(a: Date, b: Date) {
  return createDateKey(a) === createDateKey(b);
}

function isToday(date: Date) {
  return sameDate(date, new Date());
}

function getCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Senin = 0 ... Minggu = 6
  const firstWeekday =
    firstDay.getDay() === 0
      ? 6
      : firstDay.getDay() - 1;

  const daysInMonth = lastDay.getDate();

  const previousMonthLastDate = new Date(
    year,
    month,
    0
  ).getDate();

  const cells: CalendarCell[] = [];

  // Hari dari bulan sebelumnya
  for (let index = firstWeekday - 1; index >= 0; index--) {
    const day = previousMonthLastDate - index;

    cells.push({
      date: new Date(year, month - 1, day),
      currentMonth: false,
    });
  }

  // Hari bulan aktif
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  // Isi sampai 42 cell
  let nextDay = 1;

  while (cells.length < 42) {
    cells.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });

    nextDay += 1;
  }

  return cells;
}

function getStatusClass(status: string) {
  switch (status) {
    case "Terkirim":
      return "border-[#adc6ff]/10 bg-[#adc6ff]/10 text-[#adc6ff]";

    case "Ditolak":
      return "border-[#ffb4ab]/10 bg-[#ffb4ab]/10 text-[#ffb4ab]";

    default:
      return "border-white/[0.04] bg-white/[0.04] text-[#a5a7b0]";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "Terkirim":
      return "bg-[#adc6ff]";

    case "Ditolak":
      return "bg-[#ffb4ab]";

    default:
      return "bg-[#919095]";
  }
}

function StatBadge({
  count,
  label,
}: {
  count: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[#171b29] px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#0566d9]" />

      <span className="text-xs font-medium text-[#dfe1f5] sm:text-sm">
        {label} ({count})
      </span>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#777984]">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#dfe1f5]">
        <span className="text-[#adc6ff]">{icon}</span>
        {value}
      </div>
    </div>
  );
}

export default function KalenderPageContent({
  reports,
}: KalenderPageContentProps) {
  const today = new Date();

  const latestReportDate = useMemo(() => {
    if (reports.length === 0) {
      return today;
    }

    return getDateOnly(reports[reports.length - 1].tanggal);
  }, [reports]);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      latestReportDate.getFullYear(),
      latestReportDate.getMonth(),
      1
    )
  );

  const [selectedDate, setSelectedDate] =
    useState<Date>(latestReportDate);

  const reportByDate = useMemo(() => {
    const map = new Map<string, Report[]>();

    for (const report of reports) {
      const key = report.tanggal;

      const existing = map.get(key);

      if (existing) {
        existing.push(report);
      } else {
        map.set(key, [report]);
      }
    }

    return map;
  }, [reports]);

  const cells = useMemo(
    () =>
      getCalendarCells(
        currentMonth.getFullYear(),
        currentMonth.getMonth()
      ),
    [currentMonth]
  );

  const selectedReports =
    reportByDate.get(createDateKey(selectedDate)) ?? [];

  const currentMonthReportCount = useMemo(() => {
    return reports.filter((report) => {
      const date = getDateOnly(report.tanggal);

      return (
        date.getFullYear() === currentMonth.getFullYear() &&
        date.getMonth() === currentMonth.getMonth()
      );
    }).length;
  }, [reports, currentMonth]);

  function goToPreviousMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  }

  function goToNextMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  }

  function goToToday() {
    const currentDate = new Date();

    setCurrentMonth(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      )
    );

    setSelectedDate(currentDate);
  }

  function selectDate(date: Date) {
    setSelectedDate(date);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0f1320] text-[#dfe1f5]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#090e1b] to-[#0f1320] px-6 pb-12 pt-12 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0566d9]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#adc6ff]" />

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#8d8f98]">
                Jadwal & Aktivitas
              </span>
            </div>

            <h1 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl lg:text-5xl">
              Perjalanan PKL kamu, hari demi hari.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#8d8f98] sm:text-base">
              Lihat aktivitas dan laporan kamu berdasarkan
              kalender.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatBadge
              count={reports.length}
              label="Laporan"
            />

            <StatBadge
              count={
                new Set(
                  reports.map((report) => report.tanggal)
                ).size
              }
              label="Hari tercatat"
            />
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Calendar */}
          <section className="rounded-[2rem] bg-[#090e1b] p-4 shadow-xl sm:p-6 lg:col-span-8">
            {/* Calendar Header */}
            <div className="flex flex-col gap-4 border-b border-[#46464b]/30 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[#dfe1f5] sm:text-2xl">
                  {formatMonthYear(currentMonth)}
                </h2>

                <div className="flex items-center rounded-full bg-[#171b29] p-1">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    aria-label="Bulan sebelumnya"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#8d8f98] transition hover:bg-[#252938] hover:text-[#dfe1f5]"
                  >
                    <ChevronLeftIcon />
                  </button>

                  <button
                    type="button"
                    onClick={goToToday}
                    className="px-3 text-xs font-medium text-[#dfe1f5]"
                  >
                    Hari Ini
                  </button>

                  <button
                    type="button"
                    onClick={goToNextMonth}
                    aria-label="Bulan berikutnya"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#8d8f98] transition hover:bg-[#252938] hover:text-[#dfe1f5]"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#777984]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0566d9]" />
                  Ada laporan
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#353948]" />
                  Kosong
                </div>
              </div>
            </div>

            {/* Month info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-[#777984]">
                {currentMonthReportCount} laporan pada bulan ini
              </p>
            </div>

            {/* Weekday */}
            <div className="mt-5 grid grid-cols-7 text-center">
              {[
                "Sen",
                "Sel",
                "Rab",
                "Kam",
                "Jum",
                "Sab",
                "Min",
              ].map((day) => (
                <div
                  key={day}
                  className="py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#777984] sm:text-xs"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {cells.map((cell) => {
                const key = createDateKey(cell.date);
                const dayReports = reportByDate.get(key) ?? [];
                const hasReports = dayReports.length > 0;
                const selected = sameDate(
                  cell.date,
                  selectedDate
                );
                const todayDate = isToday(cell.date);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectDate(cell.date)}
                    className={[
                      "relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl p-2 text-left transition sm:p-2.5",
                      cell.currentMonth
                        ? "bg-[#171b29] hover:bg-[#252938]"
                        : "bg-[#171b29]/30 text-[#555861]",
                      selected
                        ? "bg-[#adc6ff] text-[#002e6a] hover:bg-[#adc6ff]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={[
                          "text-xs font-medium sm:text-sm",
                          !cell.currentMonth &&
                            !selected
                            ? "text-[#555861]"
                            : "",
                          selected
                            ? "font-bold text-[#002e6a]"
                            : "",
                        ].join(" ")}
                      >
                        {cell.date.getDate()}
                      </span>

                      {todayDate && !selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#adc6ff]" />
                      )}
                    </div>

                    <div className="flex justify-center gap-1">
                      {hasReports && (
                        <>
                          <span
                            className={[
                              "h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2",
                              selected
                                ? "bg-[#002e6a]"
                                : "bg-[#0566d9]",
                            ].join(" ")}
                          />

                          {dayReports.length > 1 && (
                            <span
                              className={[
                                "h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2",
                                selected
                                  ? "bg-[#002e6a]/60"
                                  : "bg-[#adc6ff]",
                              ].join(" ")}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Selected day */}
          <aside className="rounded-[2rem] bg-[#090e1b] p-5 shadow-xl sm:p-6 lg:sticky lg:top-24 lg:col-span-4 lg:h-fit">
            <div className="flex items-start justify-between gap-3 border-b border-[#46464b]/30 pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-[#adc6ff]">
                  <EventIcon />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium uppercase tracking-[0.12em] text-[#777984]">
                    Hari Terpilih
                  </p>

                  <h2 className="mt-1 text-sm font-medium text-[#dfe1f5] sm:text-base">
                    {formatSelectedDate(selectedDate)}
                  </h2>
                </div>
              </div>

              {selectedReports.length > 0 && (
                <span className="shrink-0 rounded-full border border-[#adc6ff]/10 bg-[#adc6ff]/10 px-2.5 py-1 text-[10px] font-medium text-[#adc6ff]">
                  {selectedReports.length} laporan
                </span>
              )}
            </div>

            {selectedReports.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#171b29] text-[#777984]">
                  <CalendarIcon />
                </div>

                <h3 className="mt-4 font-[family-name:var(--font-syne)] text-lg font-semibold text-[#dfe1f5]">
                  Belum ada laporan
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-[#777984]">
                  Belum ada aktivitas yang dicatat pada
                  tanggal ini.
                </p>

                <Link
                  href="/laporan/buat"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0566d9] px-5 py-2.5 text-xs font-semibold text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
                >
                  Buat Laporan
                </Link>
              </div>
            ) : (
              <div className="space-y-5 pt-5">
                {selectedReports.map((report) => (
                  <article
                    key={report.id}
                    className="border-b border-[#46464b]/20 pb-5 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold leading-6 text-[#dfe1f5]">
                          {report.judul}
                        </h3>

                        <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#8d8f98]">
                          {report.aktivitas}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                          report.status
                        )}`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              report.status
                            )}`}
                          />
                          {report.status}
                        </span>
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(report.jam_mulai ||
                        report.jam_selesai) && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#171b29] px-3 py-1.5 text-[11px] text-[#777984]">
                          <ClockIcon />

                          {formatTime(
                            report.jam_mulai
                          )}{" "}
                          —{" "}
                          {formatTime(
                            report.jam_selesai
                          )}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#171b29] px-3 py-1.5 text-[11px] text-[#777984]">
                        <FileIcon />
                        {formatFullDate(report.tanggal)}
                      </span>
                    </div>

                    <Link
                      href={`/laporan/${report.id}`}
                      className="mt-4 flex w-full items-center justify-between rounded-2xl bg-[#171b29] px-4 py-3 text-xs font-medium text-[#dfe1f5] transition hover:bg-[#252938]"
                    >
                      Lihat Laporan
                      <ArrowRightIcon />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}