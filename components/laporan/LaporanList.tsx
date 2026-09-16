"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Report = {
  id: string;
  tanggal: string;
  waktu?: string | null;
  jam_mulai?: string | null;
  jam_selesai?: string | null;
  judul: string;
  aktivitas: string;
  status: string;
};

type LaporanListProps = {
  reports: Report[];
};

type TimeFilter =
  | "Semua"
  | "Hari Ini"
  | "Minggu Ini"
  | "Bulan Ini";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
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

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDay(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
  }).format(date);
}

function formatMonth(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

function getStatusClass(status: string) {
  switch (status) {
    case "Disetujui":
      return "border-[#adc6ff]/15 bg-[#adc6ff]/10 text-[#adc6ff]";

    case "Ditolak":
      return "border-[#ffb4ab]/15 bg-[#ffb4ab]/10 text-[#ffb4ab]";

    case "Diajukan":
      return "border-[#d0bcff]/15 bg-[#d0bcff]/10 text-[#d0bcff]";

    default:
      return "border-white/5 bg-white/[0.04] text-[#c7c6cb]";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "Ditolak":
      return "bg-[#ffb4ab]";

    case "Draft":
      return "bg-[#919095]";

    default:
      return "bg-[#adc6ff]";
  }
}

function isToday(date: string) {
  const today = new Date();
  const target = new Date(`${date}T00:00:00`);

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

function isThisWeek(date: string) {
  const today = new Date();
  const target = new Date(`${date}T00:00:00`);

  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;

  const startOfWeek = new Date(today);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(today.getDate() - diff);

  return target >= startOfWeek && target <= today;
}

function isThisMonth(date: string) {
  const today = new Date();
  const target = new Date(`${date}T00:00:00`);

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth()
  );
}

function formatTime(value?: string | null) {
  if (!value) return null;

  return value.slice(0, 5);
}

export default function LaporanList({
  reports,
}: LaporanListProps) {
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] =
    useState<TimeFilter>("Semua");
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredReports = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchSearch =
        !keyword ||
        report.judul.toLowerCase().includes(keyword) ||
        report.aktivitas.toLowerCase().includes(keyword);

      let matchTime = true;

      if (timeFilter === "Hari Ini") {
        matchTime = isToday(report.tanggal);
      }

      if (timeFilter === "Minggu Ini") {
        matchTime = isThisWeek(report.tanggal);
      }

      if (timeFilter === "Bulan Ini") {
        matchTime = isThisMonth(report.tanggal);
      }

      return matchSearch && matchTime;
    });
  }, [reports, search, timeFilter]);

  const visibleReports = filteredReports.slice(
    0,
    visibleCount
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="rounded-[2rem] border border-white/[0.04] bg-[#171b29] p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-lg">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#8d8f98]">
              <SearchIcon />
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisibleCount(4);
              }}
              placeholder="Cari judul atau aktivitas..."
              className="w-full rounded-2xl border border-white/[0.04] bg-[#1b1f2d] py-3.5 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#777984] focus:border-[#adc6ff]/20 focus:ring-2 focus:ring-[#adc6ff]/10"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto rounded-2xl bg-[#1b1f2d] p-1">
            {(
              [
                "Semua",
                "Hari Ini",
                "Minggu Ini",
                "Bulan Ini",
              ] as TimeFilter[]
            ).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setTimeFilter(filter);
                  setVisibleCount(4);
                }}
                className={
                  timeFilter === filter
                    ? "whitespace-nowrap rounded-xl bg-[#0566d9] px-4 py-2.5 text-xs font-medium text-[#e6ecff]"
                    : "whitespace-nowrap rounded-xl px-4 py-2.5 text-xs text-[#999ba5] transition hover:text-[#dfe1f5]"
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm text-[#8d8f98]">
            Menampilkan{" "}
            <span className="font-medium text-[#dfe1f5]">
              {visibleReports.length}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-[#dfe1f5]">
              {filteredReports.length}
            </span>{" "}
            laporan
          </p>
        </div>

        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setVisibleCount(4);
            }}
            className="text-xs font-medium text-[#adc6ff] transition hover:text-[#dfe1f5]"
          >
            Reset pencarian
          </button>
        )}
      </div>

      {/* Reports */}
      <div className="flex flex-col gap-3">
        {visibleReports.length === 0 ? (
          <div className="rounded-[2rem] border border-white/[0.04] bg-[#1b1f2d] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#090e1b] text-[#adc6ff]">
              <FileIcon />
            </div>

            <h3 className="mt-5 font-[family-name:var(--font-syne)] text-xl font-semibold text-[#dfe1f5]">
              Tidak ada laporan
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8d8f98]">
              Belum ada laporan yang cocok dengan pencarian atau
              filter yang kamu pilih.
            </p>
          </div>
        ) : (
          visibleReports.map((report) => {
            const startTime = formatTime(report.jam_mulai);
            const endTime = formatTime(report.jam_selesai);

            return (
              <Link
                key={report.id}
                href={`/laporan/${report.id}`}
                className="group relative overflow-hidden rounded-[2rem] border border-white/[0.04] bg-[#1b1f2d] p-4 transition hover:-translate-y-0.5 hover:border-[#adc6ff]/10 hover:bg-[#202534] sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Date */}
                  <div className="flex h-24 w-full shrink-0 flex-row items-center gap-4 rounded-2xl bg-[#101523] px-5 sm:w-28 sm:flex-col sm:justify-center sm:gap-0 sm:px-0">
                    <div className="font-[family-name:var(--font-syne)] text-3xl font-bold leading-none text-[#dfe1f5]">
                      {formatDay(report.tanggal)}
                    </div>

                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-[#adc6ff]">
                      {formatMonth(report.tanggal)}
                    </div>

                    <div className="mt-1 hidden text-[10px] text-[#777984] sm:block">
                      {new Date(
                        `${report.tanggal}T00:00:00`
                      ).getFullYear()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#8d8f98]">
                        <CalendarIcon />
                        {formatDate(report.tanggal)}
                      </div>

                      <span className="h-1 w-1 rounded-full bg-[#444750]" />

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                          report.status
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            report.status
                          )}`}
                        />
                        {report.status}
                      </span>
                    </div>

                    <h3 className="mt-2 truncate font-[family-name:var(--font-syne)] text-xl font-semibold text-[#dfe1f5] transition group-hover:text-[#adc6ff]">
                      {report.judul}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 max-w-3xl text-sm leading-6 text-[#8d8f98]">
                      {report.aktivitas}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#777984]">
                      {(startTime || endTime) && (
                        <div className="flex items-center gap-1.5">
                          <ClockIcon />

                          <span>
                            {startTime ?? "--:--"}
                            {endTime && ` — ${endTime}`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <FileIcon />
                        <span>Dokumentasi kegiatan</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden shrink-0 items-center sm:flex">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#090e1b] text-[#8d8f98] transition group-hover:bg-[#adc6ff] group-hover:text-[#002e6a]">
                      <ArrowIcon />
                    </div>
                  </div>
                </div>

                {/* Mobile arrow */}
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-4 sm:hidden">
                  <span className="text-xs font-medium text-[#777984]">
                    Lihat detail laporan
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#090e1b] text-[#8d8f98] transition group-hover:bg-[#adc6ff] group-hover:text-[#002e6a]">
                    <ArrowIcon />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Load more */}
      {visibleCount < filteredReports.length && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((count) => count + 4)
            }
            className="rounded-full border border-white/[0.05] bg-[#1b1f2d] px-8 py-3.5 text-sm font-medium text-[#dfe1f5] transition hover:border-[#adc6ff]/10 hover:bg-[#252938]"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
}