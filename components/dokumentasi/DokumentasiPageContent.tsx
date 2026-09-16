"use client";

import { useMemo, useState } from "react";

type DocumentationItem = {
  id: string;
  laporanId: string;
  tanggal: string;
  judul: string;
  aktivitas: string;
  namaFile: string;
  filePath: string;
  createdAt: string;
  signedUrl: string;
};

type DokumentasiPageContentProps = {
  documentation: DocumentationItem[];
};

type FilterType = "semua" | "terbaru" | "lama";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DokumentasiPageContent({
  documentation,
}: DokumentasiPageContentProps) {
  const [filter, setFilter] = useState<FilterType>("semua");
  const [selected, setSelected] =
    useState<DocumentationItem | null>(null);

  const filteredDocumentation = useMemo(() => {
    const items = [...documentation];

    if (filter === "terbaru") {
      return items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    if (filter === "lama") {
      return items.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
    }

    return items;
  }, [documentation, filter]);

  const featured = filteredDocumentation[0];
  const galleryItems = filteredDocumentation.slice(
    featured ? 1 : 0
  );

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-6 pb-12 pt-12 md:pt-16">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[#0f0030] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#d0bcff]">
                Archive_04
              </span>

              <span className="font-mono text-xs text-[#777984]">
                {documentation.length} FILE
                {documentation.length !== 1 ? "S" : ""}
              </span>
            </div>

            <h1 className="max-w-2xl font-[Syne] text-4xl font-bold tracking-tight text-[#dfe1f5] md:text-5xl">
              Semua momen yang pernah kamu simpan.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-[#c7c6cb]">
              Kumpulan dokumentasi visual dari perjalanan PKL
              kamu. Semua foto yang kamu upload melalui laporan
              akan otomatis muncul di sini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#1b1f2d] p-1">
            {[
              {
                key: "semua" as const,
                label: "Semua",
              },
              {
                key: "terbaru" as const,
                label: "Terbaru",
              },
              {
                key: "lama" as const,
                label: "Terlama",
              },
            ].map((item) => {
              const active = filter === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-[#0566d9] text-[#e6ecff]"
                      : "text-[#c7c6cb] hover:text-[#dfe1f5]",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {documentation.length === 0 ? (
          <div className="rounded-3xl border border-[#303443] bg-[#171b29] px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#252938]">
              <span className="material-symbols-outlined text-3xl text-[#adc6ff]">
                photo_library
              </span>
            </div>

            <h2 className="mt-5 font-[Syne] text-2xl font-semibold text-[#dfe1f5]">
              Belum ada dokumentasi
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#919095]">
              Foto yang kamu upload saat membuat laporan
              harian akan otomatis tersimpan dan tampil di
              halaman ini.
            </p>

            <a
              href="/laporan/buat"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0566d9] px-6 py-3 text-sm font-medium text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
            >
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>
              Buat Laporan
            </a>
          </div>
        ) : (
          <>
            {featured && (
              <div
                className="group relative mb-6 h-[420px] cursor-pointer overflow-hidden rounded-3xl bg-[#1b1f2d] shadow-2xl md:h-[480px]"
                onClick={() => setSelected(featured)}
              >
                <img
                  src={featured.signedUrl}
                  alt={featured.namaFile}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1b] via-[#090e1b]/45 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-between gap-6 p-6 md:flex-row md:items-end md:p-10">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-[#0566d9] px-3 py-1 text-xs font-medium text-[#e6ecff]">
                        Featured
                      </span>

                      <span className="text-sm text-[#c7c6cb]">
                        {formatDate(featured.tanggal)}
                      </span>
                    </div>

                    <h2 className="max-w-3xl font-[Syne] text-2xl font-bold text-[#dfe1f5] md:text-3xl">
                      {featured.judul}
                    </h2>

                    <p className="mt-2 max-w-2xl line-clamp-2 text-sm leading-6 text-[#c7c6cb]">
                      {featured.aktivitas}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-2 self-start rounded-full bg-[#0f1320]/80 px-5 py-3 text-sm font-medium text-[#dfe1f5] backdrop-blur-md transition hover:bg-[#0f1320]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      visibility
                    </span>
                    Lihat Detail
                  </button>
                </div>
              </div>
            )}

            {galleryItems.length > 0 && (
              <div className="grid auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {galleryItems.map((item, index) => {
                  const layoutClass =
                    index % 7 === 0
                      ? "md:row-span-2"
                      : index % 7 === 2 || index % 7 === 5
                        ? "md:col-span-2"
                        : "";

                  return (
                    <article
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-[#1b1f2d] ${layoutClass}`}
                    >
                      <img
                        src={item.signedUrl}
                        alt={item.namaFile}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#090e1b] via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-[#0f1320]/75 px-3 py-1.5 text-xs text-[#dfe1f5] backdrop-blur-md">
                          Dokumentasi
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="text-xs text-[#c7c6cb]">
                          {formatDate(item.tanggal)}
                        </span>

                        <h3 className="mt-1 line-clamp-2 font-[Syne] text-lg font-semibold text-[#dfe1f5]">
                          {item.judul}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#c7c6cb] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {item.aktivitas}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090e1b]/90 p-4 backdrop-blur-xl"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-[#1b1f2d] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#0f1320]/80 text-[#dfe1f5] backdrop-blur-md transition hover:bg-[#0f1320]"
              aria-label="Tutup"
            >
              <CloseIcon />
            </button>

            <div className="max-h-[58vh] bg-[#090e1b]">
              <img
                src={selected.signedUrl}
                alt={selected.namaFile}
                className="mx-auto max-h-[58vh] w-full object-contain"
              />
            </div>

            <div className="p-6 md:p-8">
              <span className="text-sm text-[#c7c6cb]">
                {formatDate(selected.tanggal)}
              </span>

              <h3 className="mt-2 font-[Syne] text-2xl font-bold text-[#dfe1f5]">
                {selected.judul}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#c7c6cb]">
                {selected.aktivitas}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="truncate text-xs text-[#777984]">
                  {selected.namaFile}
                </span>

                <a
                  href={`/laporan/${selected.laporanId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0566d9] px-5 py-3 text-sm font-medium text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
                >
                  Lihat Laporan
                  <ArrowRightIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}