"use client";

import {
  FormEvent,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

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

type ExistingFile = {
  id: string;
  laporan_id: string;
  file_path: string;
  nama_file: string;
  created_at: string;
  url: string | null;
};

type NewFile = {
  file: File;
  preview: string;
};

type EditLaporanFormProps = {
  laporan: Laporan;
  dokumentasi: ExistingFile[];
};

type FormData = {
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  judul: string;
  aktivitas: string;
  hasil: string;
  kendala: string;
};

/* =========================
   ICONS
========================= */

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
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
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
      />
      <path d="M7 3v4M17 3v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
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
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
      <path d="m13.5 7.5 3 3" />
    </svg>
  );
}

function CheckCircleIcon() {
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
      <path d="m8 12 2.5 2.5L16 9" />
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
      <path d="M12 4 21 20H3L12 4Z" />
      <path d="M12 9v5M12 17v.5" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
      />
      <circle cx="8" cy="9" r="1.5" />
      <path d="m4 17 5-5 4 4 2-2 5 5" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M17.5 19H8a5 5 0 1 1 1.2-9.85A6 6 0 0 1 20 12.5 3.5 3.5 0 0 1 17.5 19Z" />
      <path d="M12 15V9M9.5 11.5 12 9l2.5 2.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M5 4h12l2 2v14H5V4Z" />
      <path d="M9 4v5h6V4M8 16h8" />
    </svg>
  );
}

function DeleteForeverIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l-1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

/* =========================
   HELPERS
========================= */

function formatStatus(status: string) {
  switch (status) {
    case "Draft":
      return "Draft";

    case "Terkirim":
      return "Terkirim";

    case "Diajukan":
      return "Diajukan";

    case "Disetujui":
      return "Disetujui";

    case "Ditolak":
      return "Ditolak";

    default:
      return status;
  }
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

function calculateDuration(
  start: string,
  end: string
) {
  if (!start || !end) {
    return "0 Jam";
  }

  const [startHour, startMinute] =
    start.split(":").map(Number);

  const [endHour, endMinute] =
    end.split(":").map(Number);

  const startTotal =
    startHour * 60 + startMinute;

  const endTotal =
    endHour * 60 + endMinute;

  const duration =
    endTotal - startTotal;

  if (duration <= 0) {
    return "0 Jam";
  }

  const hours = Math.floor(
    duration / 60
  );

  const minutes =
    duration % 60;

  if (!minutes) {
    return `${hours} Jam`;
  }

  return `${hours}j ${minutes}m`;
}

/* =========================
   COMPONENT
========================= */

export default function EditLaporanForm({
  laporan,
  dokumentasi,
}: EditLaporanFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [form, setForm] =
    useState<FormData>({
      tanggal: laporan.tanggal,
      jamMulai:
        laporan.jam_mulai?.slice(0, 5) ?? "",
      jamSelesai:
        laporan.jam_selesai?.slice(0, 5) ?? "",
      judul: laporan.judul ?? "",
      aktivitas: laporan.aktivitas ?? "",
      hasil: laporan.hasil ?? "",
      kendala: laporan.kendala ?? "",
    });

  const [existingFiles, setExistingFiles] =
    useState<ExistingFile[]>(
      dokumentasi
    );

  const [newFiles, setNewFiles] =
    useState<NewFile[]>([]);

  const [error, setError] = useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const totalFiles =
    existingFiles.length +
    newFiles.length;

  const duration =
    calculateDuration(
      form.jamMulai,
      form.jamSelesai
    );

  const isDraft =
    laporan.status === "Draft";

  function updateField(
    name: keyof FormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function addFiles(
    fileList: FileList | File[]
  ) {
    const files =
      Array.from(fileList);

    const remainingSlots =
      6 - totalFiles;

    if (remainingSlots <= 0) {
      setError(
        "Maksimal 6 dokumentasi untuk satu laporan."
      );
      return;
    }

    const validFiles: NewFile[] =
      [];

    for (const file of files) {
      if (
        validFiles.length >=
        remainingSlots
      ) {
        break;
      }

      if (
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(file.type)
      ) {
        setError(
          `File "${file.name}" harus berupa JPG, PNG, atau WEBP.`
        );
        continue;
      }

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        setError(
          `File "${file.name}" melebihi batas 10MB.`
        );
        continue;
      }

      validFiles.push({
        file,
        preview:
          URL.createObjectURL(
            file
          ),
      });
    }

    if (
      files.length >
      remainingSlots
    ) {
      setError(
        "Maksimal 6 dokumentasi. Sebagian file tidak ditambahkan."
      );
    }

    setNewFiles(
      (current) => [
        ...current,
        ...validFiles,
      ]
    );
  }

  function removeNewFile(
    index: number
  ) {
    setNewFiles((current) => {
      const target =
        current[index];

      if (target) {
        URL.revokeObjectURL(
          target.preview
        );
      }

      return current.filter(
        (_, fileIndex) =>
          fileIndex !== index
      );
    });
  }

  async function removeExistingFile(
    file: ExistingFile
  ) {
    if (isSaving) {
      return;
    }

    const confirmed =
      window.confirm(
        `Hapus dokumentasi "${file.nama_file}"?`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const {
        error: storageError,
      } =
        await supabase.storage
          .from("dokumentasi")
          .remove([
            file.file_path,
          ]);

      if (storageError) {
        throw new Error(
          storageError.message
        );
      }

      const {
        error: databaseError,
      } =
        await supabase
          .from("dokumentasi")
          .delete()
          .eq("id", file.id)
          .eq(
            "laporan_id",
            laporan.id
          );

      if (databaseError) {
        throw new Error(
          databaseError.message
        );
      }

      setExistingFiles(
        (current) =>
          current.filter(
            (item) =>
              item.id !== file.id
          )
      );
    } catch (
      removeError
    ) {
      setError(
        removeError instanceof
          Error
          ? removeError.message
          : "Dokumentasi gagal dihapus."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.files) {
      addFiles(
        event.target.files
      );
    }

    event.target.value = "";
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    if (event.dataTransfer.files) {
      addFiles(
        event.dataTransfer.files
      );
    }
  }

  function validateForm() {
    if (!form.tanggal) {
      return "Tanggal kegiatan wajib diisi.";
    }

    if (
      !form.jamMulai ||
      !form.jamSelesai
    ) {
      return "Jam kerja wajib diisi.";
    }

    if (
      form.jamMulai >=
      form.jamSelesai
    ) {
      return "Jam selesai harus lebih besar dari jam mulai.";
    }

    if (!form.judul.trim()) {
      return "Judul kegiatan wajib diisi.";
    }

    if (!form.aktivitas.trim()) {
      return "Deskripsi aktivitas wajib diisi.";
    }

    if (!form.hasil.trim()) {
      return "Hasil kegiatan wajib diisi.";
    }

    return "";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );
      return;
    }

    setIsSaving(true);

    try {
      const {
        data: {
          user,
        },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        router.push("/login");
        return;
      }

      if (
        user.id !==
        laporan.user_id
      ) {
        throw new Error(
          "Kamu tidak memiliki akses untuk mengubah laporan ini."
        );
      }

      const {
        error: updateError,
      } =
        await supabase
          .from("laporan")
          .update({
            tanggal:
              form.tanggal,
            waktu:
              form.jamMulai,
            jam_mulai:
              form.jamMulai,
            jam_selesai:
              form.jamSelesai,
            judul:
              form.judul.trim(),
            aktivitas:
              form.aktivitas.trim(),
            hasil:
              form.hasil.trim(),
            kendala:
              form.kendala.trim() ||
              null,
          })
          .eq(
            "id",
            laporan.id
          )
          .eq(
            "user_id",
            user.id
          );

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }

      for (const selectedFile of newFiles) {
        const file =
          selectedFile.file;

        const extension =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase() ??
          "jpg";

        const filePath =
          `${user.id}/${laporan.id}/${crypto.randomUUID()}.${extension}`;

        const {
          error: uploadError,
        } =
          await supabase.storage
            .from(
              "dokumentasi"
            )
            .upload(
              filePath,
              file,
              {
                cacheControl:
                  "3600",
                upsert:
                  false,
                contentType:
                  file.type,
              }
            );

        if (uploadError) {
          throw new Error(
            `Gagal mengunggah ${file.name}: ${uploadError.message}`
          );
        }

        const {
          error:
            documentationError,
        } =
          await supabase
            .from(
              "dokumentasi"
            )
            .insert({
              laporan_id:
                laporan.id,
              file_path:
                filePath,
              nama_file:
                file.name,
            });

        if (
          documentationError
        ) {
          await supabase.storage
            .from(
              "dokumentasi"
            )
            .remove([
              filePath,
            ]);

          throw new Error(
            `Gagal menyimpan dokumentasi: ${documentationError.message}`
          );
        }
      }

      router.push(
        `/laporan/${laporan.id}`
      );
      router.refresh();
    } catch (
      submitError
    ) {
      setError(
        submitError instanceof
          Error
          ? submitError.message
          : "Terjadi kesalahan saat menyimpan perubahan."
      );

      setIsSaving(false);
    }
  }

  async function handleDeleteReport() {
    if (
      isSaving ||
      !isDraft
    ) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const response =
        await fetch(
          `/api/laporan/${laporan.id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Laporan gagal dihapus."
        );
      }

      setShowDeleteModal(false);

      router.push("/laporan");
      router.refresh();
    } catch (
      deleteError
    ) {
      setError(
        deleteError instanceof
          Error
          ? deleteError.message
          : "Terjadi kesalahan saat menghapus laporan."
      );

      setIsSaving(false);
    }
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute left-1/4 top-[-5rem] -z-10 h-96 w-96 rounded-full bg-[#0566d9]/10 blur-3xl" />

      <div className="pointer-events-none absolute right-10 top-96 -z-10 h-80 w-80 rounded-full bg-[#0f0030]/30 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* TOP CONTEXT */}
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/laporan/${laporan.id}`
                )
              }
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#171b29] px-4 py-2 text-sm text-[#c7c6cb] transition hover:text-[#adc6ff]"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">
                <ArrowLeftIcon />
              </span>

              Kembali ke Detail Laporan
            </button>

            <span className="hidden text-[#46464b] sm:inline">
              •
            </span>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#252938] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#c7c6cb]">
              <span
                className={`h-2 w-2 rounded-full ${
                  isDraft
                    ? "animate-pulse bg-[#f59e0b]"
                    : "bg-[#adc6ff]"
                }`}
              />

              Jurnal Harian PKL

              <span className="text-[#777984]">
                •
              </span>

              Mode Edit
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-full bg-[#171b29] px-4 py-2 text-xs text-[#c7c6cb]">
            <span className="flex items-center gap-1.5 font-mono text-[#adc6ff]">
              <span className="material-symbols-outlined text-[16px]">
                tag
              </span>

              #
              {laporan.id
                .slice(0, 8)
                .toUpperCase()}
            </span>

            <span className="text-[#46464b]">
              /
            </span>

            <span>
              Dibuat{" "}
              {formatDate(
                laporan.created_at
              )}
            </span>

            <span
              className={`rounded-full px-3 py-1 ${
                isDraft
                  ? "bg-[#f59e0b]/10 text-[#fbbf24]"
                  : "bg-[#adc6ff]/10 text-[#adc6ff]"
              }`}
            >
              {formatStatus(
                laporan.status
              )}
            </span>
          </div>
        </div>

        {/* HEADER */}
        <div className="mb-10 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#adc6ff]">
                Dokumentasi Kerja Lapangan
              </span>

              <span className="h-px w-8 bg-[#adc6ff]/40" />
            </div>

            <h1 className="mt-3 font-[Syne] text-4xl font-bold tracking-tight text-[#dfe1f5] md:text-5xl">
              Perbarui Laporan Kegiatan
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#c7c6cb]">
              Perbaiki atau lengkapi data kegiatan,
              hasil capaian, kendala teknis, serta
              dokumentasi PKL kamu.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[#171b29] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0566d9]/20 text-[#adc6ff]">
                <ClockIcon />
              </div>

              <div className="min-w-0">
                <div className="text-xs text-[#919095]">
                  Durasi Terekam
                </div>

                <div className="mt-1 truncate font-[Syne] text-base font-semibold text-[#dfe1f5]">
                  {duration}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#171b29] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#252938] text-[#dfe1f5]">
                <ImageIcon />
              </div>

              <div className="min-w-0">
                <div className="text-xs text-[#919095]">
                  Dokumentasi
                </div>

                <div className="mt-1 truncate font-[Syne] text-base font-semibold text-[#dfe1f5]">
                  {totalFiles} / 6 Berkas
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* SECTION 01 */}
          <section className="rounded-3xl bg-[#1b1f2d] p-6 shadow-xl sm:p-8">
            <div className="mb-7 flex flex-col gap-4 border-b border-[#46464b]/30 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0566d9]/30 text-sm font-bold text-[#adc6ff]">
                  01
                </span>

                <div>
                  <h2 className="font-[Syne] text-xl font-semibold text-[#dfe1f5]">
                    Waktu & Judul Kegiatan
                  </h2>

                  <p className="mt-1 text-sm text-[#919095]">
                    Tentukan waktu kerja dan pokok kegiatan laporan.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-[#252938] px-4 py-1.5 text-xs uppercase tracking-wider text-[#919095]">
                Core
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
              <div className="flex flex-col gap-2 md:col-span-4">
                <label
                  htmlFor="tanggal"
                  className="flex items-center gap-2 text-sm font-medium text-[#c7c6cb]"
                >
                  <CalendarIcon />
                  Tanggal Kegiatan
                </label>

                <input
                  id="tanggal"
                  type="date"
                  value={form.tanggal}
                  onChange={(event) =>
                    updateField(
                      "tanggal",
                      event.target.value
                    )
                  }
                  required
                  disabled={isSaving}
                  className="w-full rounded-2xl bg-[#252938] px-4 py-3.5 text-sm text-[#dfe1f5] outline-none transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-8">
                <label className="flex items-center gap-2 text-sm font-medium text-[#c7c6cb]">
                  <ClockIcon />
                  Jam Operasional
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <span className="mb-1.5 block text-xs text-[#777984]">
                      Jam Mulai
                    </span>

                    <input
                      type="time"
                      value={
                        form.jamMulai
                      }
                      onChange={(event) =>
                        updateField(
                          "jamMulai",
                          event.target.value
                        )
                      }
                      required
                      disabled={isSaving}
                      className="w-full rounded-2xl bg-[#252938] px-4 py-3.5 font-mono text-sm text-[#dfe1f5] outline-none transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <span className="mb-1.5 block text-xs text-[#777984]">
                      Jam Selesai
                    </span>

                    <input
                      type="time"
                      value={
                        form.jamSelesai
                      }
                      onChange={(event) =>
                        updateField(
                          "jamSelesai",
                          event.target.value
                        )
                      }
                      required
                      disabled={isSaving}
                      className="w-full rounded-2xl bg-[#252938] px-4 py-3.5 font-mono text-sm text-[#dfe1f5] outline-none transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-12">
                <label
                  htmlFor="judul"
                  className="flex items-center gap-2 text-sm font-medium text-[#c7c6cb]"
                >
                  <EditIcon />
                  Judul Kegiatan Utama
                </label>

                <input
                  id="judul"
                  type="text"
                  value={form.judul}
                  onChange={(event) =>
                    updateField(
                      "judul",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Membantu pelayanan administrasi masyarakat"
                  required
                  disabled={isSaving}
                  className="w-full rounded-2xl bg-[#252938] px-4 py-4 text-base text-[#dfe1f5] outline-none placeholder:text-[#777984] transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
                />
              </div>
            </div>
          </section>

          {/* SECTION 02 */}
          <section className="rounded-3xl bg-[#1b1f2d] p-6 shadow-xl sm:p-8">
            <div className="mb-7 flex flex-col gap-4 border-b border-[#46464b]/30 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0566d9]/30 text-sm font-bold text-[#adc6ff]">
                  02
                </span>

                <div>
                  <h2 className="font-[Syne] text-xl font-semibold text-[#dfe1f5]">
                    Rincian Aktivitas, Output & Kendala
                  </h2>

                  <p className="mt-1 text-sm text-[#919095]">
                    Jelaskan proses pekerjaan dan hasil yang diperoleh.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-[#0566d9]/10 px-4 py-1.5 text-xs text-[#adc6ff]">
                Jurnal Harian
              </span>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <label
                    htmlFor="aktivitas"
                    className="flex items-center gap-2 text-sm font-medium text-[#dfe1f5]"
                  >
                    <span className="text-[#adc6ff]">
                      <EditIcon />
                    </span>

                    Apa yang kamu kerjakan hari ini?
                  </label>

                  <span className="text-xs text-[#777984]">
                    Wajib diisi
                  </span>
                </div>

                <textarea
                  id="aktivitas"
                  value={
                    form.aktivitas
                  }
                  onChange={(event) =>
                    updateField(
                      "aktivitas",
                      event.target.value
                    )
                  }
                  placeholder="Jelaskan secara detail pekerjaan yang kamu lakukan hari ini..."
                  required
                  rows={7}
                  disabled={isSaving}
                  className="w-full resize-y rounded-2xl bg-[#252938] p-5 text-sm leading-7 text-[#dfe1f5] outline-none placeholder:text-[#777984] transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="hasil"
                      className="flex items-center gap-2 text-sm font-medium text-[#dfe1f5]"
                    >
                      <span className="text-[#6ee7b7]">
                        <CheckCircleIcon />
                      </span>

                      Hasil atau Output
                    </label>

                    <span className="text-xs text-[#6ee7b7]">
                      Wajib
                    </span>
                  </div>

                  <textarea
                    id="hasil"
                    value={form.hasil}
                    onChange={(event) =>
                      updateField(
                        "hasil",
                        event.target.value
                      )
                    }
                    placeholder="Tuliskan hasil atau capaian kegiatan..."
                    required
                    rows={7}
                    disabled={isSaving}
                    className="w-full resize-y rounded-2xl bg-[#252938] p-5 text-sm leading-7 text-[#dfe1f5] outline-none placeholder:text-[#777984] transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="kendala"
                      className="flex items-center gap-2 text-sm font-medium text-[#dfe1f5]"
                    >
                      <span className="text-[#fbbf24]">
                        <WarningIcon />
                      </span>

                      Kendala & Solusi
                    </label>

                    <span className="text-xs text-[#fbbf24]">
                      Opsional
                    </span>
                  </div>

                  <textarea
                    id="kendala"
                    value={
                      form.kendala
                    }
                    onChange={(event) =>
                      updateField(
                        "kendala",
                        event.target.value
                      )
                    }
                    placeholder="Tuliskan kendala dan solusi yang dilakukan..."
                    rows={7}
                    disabled={isSaving}
                    className="w-full resize-y rounded-2xl bg-[#252938] p-5 text-sm leading-7 text-[#dfe1f5] outline-none placeholder:text-[#777984] transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 03 */}
          <section className="rounded-3xl bg-[#1b1f2d] p-6 shadow-xl sm:p-8">
            <div className="mb-7 flex flex-col gap-4 border-b border-[#46464b]/30 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0566d9]/30 text-sm font-bold text-[#adc6ff]">
                  03
                </span>

                <div>
                  <h2 className="font-[Syne] text-xl font-semibold text-[#dfe1f5]">
                    Dokumentasi Lampiran & Foto
                  </h2>

                  <p className="mt-1 text-sm text-[#919095]">
                    Maksimal 6 berkas. JPG, PNG, atau WEBP hingga 10MB/file.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-[#0566d9]/10 px-4 py-1.5 font-mono text-xs text-[#adc6ff]">
                {totalFiles} / 6 Slot Terisi
              </span>
            </div>

            {existingFiles.length > 0 && (
              <div className="mb-7">
                <h3 className="mb-3 text-sm font-medium text-[#dfe1f5]">
                  Dokumentasi Saat Ini
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {existingFiles.map(
                    (file) => (
                      <div
                        key={file.id}
                        className="group overflow-hidden rounded-2xl bg-[#252938]"
                      >
                        <div className="relative h-44 overflow-hidden bg-[#303443]">
                          {file.url ? (
                            <img
                              src={file.url}
                              alt={
                                file.nama_file
                              }
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-[#777984]">
                              Preview tidak tersedia
                            </div>
                          )}

                          <div className="absolute left-3 top-3 max-w-[calc(100%-5rem)] truncate rounded-full bg-[#090e1b]/80 px-3 py-1 text-[11px] text-[#dfe1f5] backdrop-blur-md">
                            {
                              file.nama_file
                            }
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeExistingFile(
                                file
                              )
                            }
                            disabled={
                              isSaving
                            }
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#93000a] text-[#ffdad6] shadow-lg transition hover:scale-105 disabled:opacity-60"
                            title="Hapus Foto"
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="truncate text-xs text-[#c7c6cb]">
                            Dokumentasi
                          </span>

                          <span className="text-[11px] text-[#777984]">
                            Tersimpan
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {totalFiles < 6 && (
              <div
                onClick={() =>
                  !isSaving &&
                  fileInputRef.current?.click()
                }
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={handleDrop}
                className={`group rounded-3xl border-2 border-dashed border-[#46464b] bg-[#252938]/50 p-10 text-center transition ${
                  isSaving
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-[#adc6ff] hover:bg-[#252938]"
                }`}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0566d9]/20 text-[#adc6ff] transition-transform group-hover:scale-110">
                  <UploadIcon />
                </div>

                <h3 className="font-[Syne] text-lg font-semibold text-[#dfe1f5]">
                  Unggah Berkas Baru
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#919095]">
                  Tarik dan lepas foto di sini atau klik untuk
                  memilih file dari perangkat.
                </p>

                <span className="mt-4 inline-flex rounded-full bg-[#0f1320] px-4 py-1.5 text-[11px] font-mono text-[#777984]">
                  PNG, JPG, WEBP • MAX 10MB
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  disabled={isSaving}
                  className="hidden"
                  onChange={
                    handleFileChange
                  }
                />
              </div>
            )}

            {newFiles.length > 0 && (
              <div className="mt-7">
                <h3 className="mb-3 text-sm font-medium text-[#dfe1f5]">
                  Dokumentasi Baru
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {newFiles.map(
                    (
                      selectedFile,
                      index
                    ) => (
                      <div
                        key={`${selectedFile.file.name}-${index}`}
                        className="group overflow-hidden rounded-2xl bg-[#252938]"
                      >
                        <div className="relative h-44 overflow-hidden bg-[#303443]">
                          <img
                            src={
                              selectedFile.preview
                            }
                            alt={
                              selectedFile.file.name
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          <div className="absolute left-3 top-3 max-w-[calc(100%-5rem)] truncate rounded-full bg-[#090e1b]/80 px-3 py-1 text-[11px] text-[#dfe1f5] backdrop-blur-md">
                            {
                              selectedFile
                                .file
                                .name
                            }
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeNewFile(
                                index
                              )
                            }
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#93000a] text-[#ffdad6] shadow-lg transition hover:scale-105"
                            title="Hapus Foto"
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-xs text-[#c7c6cb]">
                            Akan ditambahkan
                          </span>

                          <span className="text-[11px] text-[#adc6ff]">
                            Baru
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </section>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-5 py-4 text-sm leading-6 text-[#ffb4ab]"
            >
              {error}
            </div>
          )}

          {/* BOTTOM ACTION BAR */}
          <div className="sticky bottom-4 z-40 rounded-3xl bg-[#252938]/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                {isDraft && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowDeleteModal(
                        true
                      )
                    }
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-[#ffb4ab] transition hover:bg-[#93000a]/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <DeleteForeverIcon />
                    Hapus Laporan
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/laporan/${laporan.id}`
                    )
                  }
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm text-[#c7c6cb] transition hover:bg-[#171b29] hover:text-[#dfe1f5] disabled:opacity-50"
                >
                  Batal
                </button>
              </div>

              <div className="flex w-full md:w-auto">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0566d9] px-7 py-3.5 text-sm font-semibold text-[#e6ecff] shadow-lg transition hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                >
                  <SaveIcon />

                  {isSaving
                    ? "Menyimpan..."
                    : "Simpan Perubahan Laporan"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* BRAND */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[#46464b]/20 pt-6 text-xs text-[#777984] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#adc6ff]" />

            <span>
              PKL Journal Editor Console • Rev. 2026.4
            </span>
          </div>

          <span>
            © 2026 PKL Journal. All rights reserved.
          </span>
        </div>
      </div>

      {/* =========================
          DELETE MODAL
          SAMA DENGAN DETAIL LAPORAN
      ========================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#090e1b]/80 px-5 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[2rem] border border-white/[0.05] bg-[#1b1f2d] p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#93000a]/20 text-[#ffb4ab]">
              <DeleteForeverIcon />
            </div>

            <h3 className="mt-5 font-[family-name:var(--font-syne)] text-2xl font-semibold text-[#dfe1f5]">
              Hapus Laporan?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8d8f98]">
              Laporan ini akan dihapus secara permanen beserta dokumentasinya.
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
                disabled={isSaving}
                className="rounded-full bg-[#252938] px-5 py-3 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#353948] disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteReport
                }
                disabled={isSaving}
                className="rounded-full bg-[#93000a] px-5 py-3 text-sm font-semibold text-[#ffdad6] transition hover:bg-[#b3261e] disabled:opacity-60"
              >
                {isSaving
                  ? "Memproses..."
                  : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}