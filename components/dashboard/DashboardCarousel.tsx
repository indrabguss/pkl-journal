"use client";

import { useRef } from "react";
import Link from "next/link";

type Report = {
  id: string;
  tanggal: string;
  judul: string;
  aktivitas: string;
};

type DashboardCarouselProps = {
  reports?: Report[];
};

function ArrowIcon({
  direction,
}: {
  direction: "left" | "right";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="m15 6-6 6 6 6" />
      ) : (
        <path d="m9 6 6 6-6 6" />
      )}
    </svg>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function DashboardCarousel({
  reports = [],
}: DashboardCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollCarousel(direction: "left" | "right") {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const amount = track.clientWidth * 0.75;

    track.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="w-full overflow-hidden bg-[#0f1320] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-[#c7c6cb]">
              Highlight Kegiatan
            </span>

            <h2 className="mt-1 font-[family-name:var(--font-syne)] text-3xl font-bold text-[#dfe1f5]">
              Cerita dari Perjalanan PKL
            </h2>
          </div>

          {reports.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Kegiatan sebelumnya"
                onClick={() => scrollCarousel("left")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1f2d] text-[#dfe1f5] transition hover:bg-[#252938]"
              >
                <ArrowIcon direction="left" />
              </button>

              <button
                type="button"
                aria-label="Kegiatan berikutnya"
                onClick={() => scrollCarousel("right")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1f2d] text-[#dfe1f5] transition hover:bg-[#252938]"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="rounded-[2rem] bg-[#1b1f2d] p-8 text-center">
            <p className="text-sm text-[#c7c6cb]">
              Belum ada kegiatan untuk ditampilkan.
            </p>

            <Link
              href="/laporan/buat"
              className="mt-4 inline-flex rounded-full bg-[#0566d9] px-5 py-3 text-sm font-medium text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
            >
              Buat Laporan Hari Ini
            </Link>
          </div>
        ) : (
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reports.map((report) => (
              <article
                key={report.id}
                className="relative flex min-h-[280px] min-w-[320px] snap-start flex-col justify-between overflow-hidden rounded-[2rem] bg-[#1b1f2d] p-6 sm:min-w-[420px]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0566d9]/10 via-transparent to-[#895af4]/10" />

                <div className="relative z-10">
                  <div className="mb-4">
                    <span className="rounded-full bg-[#303443] px-3 py-1 text-xs text-[#c7c6cb]">
                      {formatDate(report.tanggal)}
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold leading-7 text-[#dfe1f5]">
                    {report.judul}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#c7c6cb]">
                    {report.aktivitas}
                  </p>
                </div>

                <Link
                  href={`/laporan/${report.id}`}
                  className="relative z-10 mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#adc6ff] hover:underline"
                >
                  Lihat Laporan
                  <ArrowIcon direction="right" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}