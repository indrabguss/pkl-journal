"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

type Laporan = {
  id: string;
  user_id: string;
  tanggal: string;
  waktu?: string | null;
  jam_mulai?: string | null;
  jam_selesai?: string | null;
  judul: string;
  aktivitas: string;
  hasil: string | null;
  kendala: string | null;
  status: string;
  created_at: string;
};

type Dokumentasi = {
  id: string;
  file_path: string;
  nama_file: string;
  created_at: string;
  url: string | null;
};

type DetailLaporanProps = {
  laporan: Laporan;
  dokumentasi: Dokumentasi[];
};

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
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
      className="h-[18px] w-[18px]"
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m12 3 9 17H3Z" />
      <path d="M12 9v4M12 17h.01" />
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
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateUpper(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(`${value}T00:00:00`))
    .toUpperCase();
}

function formatTime(value?: string | null) {
  return value ? value.slice(0, 5) : "--:--";
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Terkirim":
      return "border-[#adc6ff]/15 bg-[#adc6ff]/10 text-[#adc6ff]";

    case "Ditolak":
      return "border-[#ffb4ab]/15 bg-[#ffb4ab]/10 text-[#ffb4ab]";

    default:
      return "border-white/[0.05] bg-white/[0.04] text-[#c7c6cb]";
  }
}

function ContentCard({
  title,
  icon,
  children,
  warning = false,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  warning?: boolean;
}) {
  return (
    <section className="rounded-[2rem] bg-[#1b1f2d] p-6 sm:p-7">
      <div
        className={`flex items-center gap-3 border-b border-white/[0.05] pb-4 ${
          warning ? "text-[#ffb4ab]" : "text-[#adc6ff]"
        }`}
      >
        <span>{icon}</span>

        <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[#dfe1f5]">
          {title}
        </h2>
      </div>

      <div className="pt-5">{children}</div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#777984]">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2.5 text-sm font-medium text-[#dfe1f5]">
        <span className="text-[#adc6ff]">{icon}</span>
        {value}
      </div>
    </div>
  );
}

export default function DetailLaporan({
  laporan,
  dokumentasi,
}: DetailLaporanProps) {
  const router = useRouter();

  const [action, setAction] = useState<
    "delete" | "send" | null
  >(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const isDraft = laporan.status === "Draft";

  async function handleSend() {
    setError("");
    setIsProcessing(true);

    try {
      const response = await fetch(
        `/api/laporan/${laporan.id}/kirim`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Laporan gagal dikirim."
        );
      }

      setAction(null);
      router.refresh();
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Terjadi kesalahan saat mengirim laporan."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDelete() {
    setError("");
    setIsProcessing(true);

    try {
      const response = await fetch(
        `/api/laporan/${laporan.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Laporan gagal dihapus."
        );
      }

      router.push("/laporan");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Terjadi kesalahan saat menghapus laporan."
      );

      setIsProcessing(false);
    }
  }

  return (
    <>
      <div className="space-y-8">
        {/* =========================
            HEADER
        ========================== */}
        <section className="flex flex-col gap-6 border-b border-white/[0.05] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#777984]">
              <span>{formatDateUpper(laporan.tanggal)}</span>
              <span>•</span>
              <span>JURNAL HARIAN PKL</span>
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl lg:text-5xl">
              {laporan.judul}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusStyle(
                  laporan.status
                )}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {laporan.status}
              </span>

              {dokumentasi.length > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-[#171b29] px-3 py-1.5 text-xs text-[#8d8f98]">
                  <FileIcon />
                  {dokumentasi.length} dokumentasi
                </span>
              )}
            </div>
          </div>

          {/* Hanya Edit + Hapus */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/laporan/${laporan.id}/edit`}
              className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-5 py-3 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#353948]"
            >
              <EditIcon />
              Edit Laporan
            </Link>

            {isDraft && (
              <button
                type="button"
                onClick={() => setAction("delete")}
                className="inline-flex items-center gap-2 rounded-full bg-[#93000a] px-5 py-3 text-sm font-medium text-[#ffdad6] transition hover:bg-[#b3261e]"
              >
                <DeleteIcon />
                Hapus
              </button>
            )}
          </div>
        </section>

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-8">
            {/* Dokumentasi utama */}
            {dokumentasi.length > 0 && dokumentasi[0].url ? (
              <div className="group relative overflow-hidden rounded-[2rem] bg-[#171b29]">
                <img
                  src={dokumentasi[0].url}
                  alt={dokumentasi[0].nama_file}
                  className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-[1.02] sm:h-[400px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1320] via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <span className="rounded-full bg-[#0f1320]/80 px-4 py-2 text-xs text-[#dfe1f5] backdrop-blur-md">
                    Dokumentasi Utama
                  </span>

                  <span className="rounded-full bg-[#0f1320]/80 px-4 py-2 text-xs text-[#8d8f98] backdrop-blur-md">
                    {dokumentasi.length} foto
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-[260px] items-center justify-center rounded-[2rem] border border-white/[0.04] bg-[#171b29] sm:h-[320px]">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#090e1b] text-[#777984]">
                    <FileIcon />
                  </div>

                  <p className="mt-4 text-sm text-[#777984]">
                    Belum ada dokumentasi untuk laporan ini.
                  </p>
                </div>
              </div>
            )}

            {/* Aktivitas */}
            <ContentCard
              title="Aktivitas Hari Ini"
              icon={<CheckIcon />}
            >
              <p className="whitespace-pre-line text-[15px] leading-7 text-[#a8aab4]">
                {laporan.aktivitas}
              </p>
            </ContentCard>

            {/* Hasil */}
            <ContentCard
              title="Hasil Kegiatan"
              icon={<CheckIcon />}
            >
              <p className="whitespace-pre-line text-[15px] leading-7 text-[#a8aab4]">
                {laporan.hasil || "Belum ada hasil kegiatan."}
              </p>
            </ContentCard>

            {/* Kendala */}
            {laporan.kendala && (
              <ContentCard
                title="Kendala"
                icon={<WarningIcon />}
                warning
              >
                <p className="whitespace-pre-line text-[15px] leading-7 text-[#a8aab4]">
                  {laporan.kendala}
                </p>
              </ContentCard>
            )}

            {/* Galeri */}
            {dokumentasi.length > 1 && (
              <section>
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#777984]">
                    Dokumentasi
                  </p>

                  <h2 className="mt-1 font-[family-name:var(--font-syne)] text-2xl font-semibold text-[#dfe1f5]">
                    Galeri Kegiatan
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {dokumentasi.slice(1).map((file) => (
                    <a
                      key={file.id}
                      href={file.url ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-2xl bg-[#171b29]"
                    >
                      {file.url ? (
                        <img
                          src={file.url}
                          alt={file.nama_file}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#777984]">
                          <FileIcon />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-[#0f1320]/10 transition group-hover:bg-transparent" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              <section className="rounded-[2rem] bg-[#1b1f2d] p-6">
                <h2 className="border-b border-white/[0.05] pb-4 font-[family-name:var(--font-syne)] text-lg font-semibold text-[#dfe1f5]">
                  Informasi Jurnal
                </h2>

                <div className="space-y-5 pt-5">
                  <InfoRow
                    label="Tanggal"
                    value={formatDate(laporan.tanggal)}
                    icon={<CalendarIcon />}
                  />

                  <InfoRow
                    label="Waktu Kerja"
                    value={`${formatTime(
                      laporan.jam_mulai
                    )} — ${formatTime(laporan.jam_selesai)}`}
                    icon={<ClockIcon />}
                  />

                  <InfoRow
                    label="Status Laporan"
                    value={laporan.status}
                    icon={<CheckIcon />}
                  />

                  <div className="border-t border-white/[0.05] pt-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#777984]">
                      Dokumentasi
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#dfe1f5]">
                      {dokumentasi.length === 0
                        ? "Tidak ada dokumentasi"
                        : `${dokumentasi.length} file gambar`}
                    </p>
                  </div>
                </div>
              </section>

              {/* Draft info */}
              {isDraft && (
                <section className="rounded-[2rem] border border-[#adc6ff]/10 bg-[#171b29] p-6">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#adc6ff]">
                    Status Draft
                  </span>

                  <p className="mt-3 text-sm leading-6 text-[#8d8f98]">
                    Laporan ini masih berupa draft. Periksa kembali
                    seluruh isi laporan sebelum mengirimkannya.
                  </p>
                </section>
              )}
            </div>
          </aside>
        </div>

        {/* =========================
            BOTTOM SEND ACTION
        ========================== */}
        {isDraft && (
          <section className="rounded-[2rem] border border-[#adc6ff]/10 bg-[#171b29] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-[family-name:var(--font-syne)] text-lg font-semibold text-[#dfe1f5]">
                  Laporan masih berupa Draft
                </p>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#8d8f98]">
                  Pastikan tanggal, waktu, aktivitas, hasil,
                  kendala, dan dokumentasi sudah benar sebelum
                  laporan dikirim.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAction("send")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0566d9] px-7 py-3.5 text-sm font-semibold text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
              >
                <SendIcon />
                Kirim Laporan
              </button>
            </div>
          </section>
        )}
      </div>

      {/* =========================
          ERROR
      ========================== */}
      {error && (
        <div className="fixed bottom-5 left-5 right-5 z-[70] mx-auto max-w-lg rounded-2xl border border-[#ffb4ab]/20 bg-[#93000a] px-5 py-4 text-sm text-[#ffdad6] shadow-2xl">
          {error}
        </div>
      )}

      {/* =========================
          MODAL
      ========================== */}
      {action && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#090e1b]/80 px-5 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[2rem] border border-white/[0.05] bg-[#1b1f2d] p-6 shadow-2xl">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                action === "delete"
                  ? "bg-[#93000a]/20 text-[#ffb4ab]"
                  : "bg-[#0566d9]/15 text-[#adc6ff]"
              }`}
            >
              {action === "delete" ? (
                <DeleteIcon />
              ) : (
                <SendIcon />
              )}
            </div>

            <h3 className="mt-5 font-[family-name:var(--font-syne)] text-2xl font-semibold text-[#dfe1f5]">
              {action === "delete"
                ? "Hapus Laporan?"
                : "Kirim Laporan?"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8d8f98]">
              {action === "delete"
                ? "Laporan ini akan dihapus secara permanen beserta dokumentasinya. Tindakan ini tidak dapat dibatalkan."
                : "Laporan akan berubah dari Draft menjadi Terkirim. Pastikan seluruh isi laporan sudah benar sebelum melanjutkan."}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setAction(null)}
                disabled={isProcessing}
                className="rounded-full bg-[#252938] px-5 py-3 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#353948] disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  action === "delete"
                    ? handleDelete
                    : handleSend
                }
                disabled={isProcessing}
                className={
                  action === "delete"
                    ? "rounded-full bg-[#93000a] px-5 py-3 text-sm font-semibold text-[#ffdad6] transition hover:bg-[#b3261e] disabled:opacity-60"
                    : "rounded-full bg-[#0566d9] px-5 py-3 text-sm font-semibold text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:opacity-60"
                }
              >
                {isProcessing
                  ? "Memproses..."
                  : action === "delete"
                    ? "Ya, Hapus"
                    : "Ya, Kirim Laporan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}