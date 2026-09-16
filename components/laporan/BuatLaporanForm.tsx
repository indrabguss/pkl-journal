"use client";

import {
  FormEvent,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FormData = {
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  judul: string;
  aktivitas: string;
  hasil: string;
  kendala: string;
};

type SelectedFile = {
  file: File;
  preview: string;
};

function EventIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
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

function DescriptionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M6 3h9l3 3v15H6V3Z" />
      <path d="M14 3v4h4M9 11h6M9 15h6M9 18h4" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
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
      <circle
        cx="8"
        cy="9"
        r="1.5"
      />
      <path d="m4 17 5-5 4 4 2-2 5 5" />
    </svg>
  );
}

function CloudUploadIcon() {
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

export default function BuatLaporanForm() {
  const router = useRouter();
  const supabase = createClient();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const today = new Date()
    .toISOString()
    .slice(0, 10);

  const [form, setForm] =
    useState<FormData>({
      tanggal: today,
      jamMulai: "08:00",
      jamSelesai: "17:00",
      judul: "",
      aktivitas: "",
      hasil: "",
      kendala: "",
    });

  const [selectedFiles, setSelectedFiles] =
    useState<SelectedFile[]>([]);

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] =
    useState(false);

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
    const files = Array.from(fileList);

    const validFiles: SelectedFile[] =
      [];

    const currentCount =
      selectedFiles.length;

    if (currentCount >= 6) {
      setError(
        "Maksimal 6 foto dokumentasi."
      );
      return;
    }

    for (const file of files) {
      if (
        validFiles.length +
          currentCount >=
        6
      ) {
        setError(
          "Maksimal 6 foto dokumentasi."
        );
        break;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError(
          "Dokumentasi hanya boleh berupa JPG, PNG, atau WEBP."
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
          URL.createObjectURL(file),
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles((current) => [
        ...current,
        ...validFiles,
      ]);
    }
  }

  function removeFile(index: number) {
    setSelectedFiles((current) => {
      const target = current[index];

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

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.files) {
      addFiles(event.target.files);
    }

    event.target.value = "";
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    if (isSaving) return;

    addFiles(
      event.dataTransfer.files
    );
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

    if (isSaving) return;

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

      /*
       * Tombol "Simpan Laporan"
       * sekarang langsung membuat
       * laporan dengan status TERKIRIM.
       *
       * Dokumentasi bersifat opsional.
       */
      const {
        data: laporan,
        error: laporanError,
      } = await supabase
        .from("laporan")
        .insert({
          user_id: user.id,
          tanggal: form.tanggal,
          waktu: form.jamMulai,
          jam_mulai: form.jamMulai,
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
          status: "Terkirim",
        })
        .select("id")
        .single();

      if (
        laporanError ||
        !laporan
      ) {
        throw new Error(
          laporanError?.message ??
            "Laporan gagal dikirim."
        );
      }

      /*
       * Upload dokumentasi hanya
       * kalau user memang memilih foto.
       *
       * Kalau tidak ada foto,
       * proses tetap lanjut.
       */
      for (const selectedFile of selectedFiles) {
        const file =
          selectedFile.file;

        const fileExtension =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase() ??
          "jpg";

        const filePath =
          `${user.id}/${laporan.id}/${crypto.randomUUID()}.${fileExtension}`;

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
                upsert: false,
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
          throw new Error(
            `Gagal menyimpan dokumentasi: ${documentationError.message}`
          );
        }
      }

      /*
       * Setelah laporan berhasil
       * dibuat, langsung buka
       * halaman detail laporan.
       */
      router.push(
        `/laporan/${laporan.id}`
      );
      router.refresh();
    } catch (submitError) {
      console.error(
        "Gagal mengirim laporan:",
        submitError
      );

      setError(
        submitError instanceof
          Error
          ? submitError.message
          : "Terjadi kesalahan saat mengirim laporan."
      );

      setIsSaving(false);
    }
  }

  async function handleSaveDraft() {
    if (isSaving) return;

    setError("");
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

      const {
        data: draft,
        error: draftError,
      } =
        await supabase
          .from("laporan")
          .insert({
            user_id: user.id,
            tanggal:
              form.tanggal,
            waktu:
              form.jamMulai,
            jam_mulai:
              form.jamMulai,
            jam_selesai:
              form.jamSelesai,
            judul:
              form.judul.trim() ||
              "Laporan Tanpa Judul",
            aktivitas:
              form.aktivitas.trim() ||
              "Draft aktivitas",
            hasil:
              form.hasil.trim() ||
              null,
            kendala:
              form.kendala.trim() ||
              null,
            status: "Draft",
          })
          .select("id")
          .single();

      if (
        draftError ||
        !draft
      ) {
        throw new Error(
          draftError?.message ??
            "Draft gagal disimpan."
        );
      }

      /*
       * Dokumentasi juga ikut disimpan
       * ketika user memilih "Simpan
       * sebagai Draft".
       */
      for (const selectedFile of selectedFiles) {
        const file =
          selectedFile.file;

        const fileExtension =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase() ??
          "jpg";

        const filePath =
          `${user.id}/${draft.id}/${crypto.randomUUID()}.${fileExtension}`;

        const {
          error:
            uploadError,
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
                upsert: false,
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
                draft.id,
              file_path:
                filePath,
              nama_file:
                file.name,
            });

        if (
          documentationError
        ) {
          throw new Error(
            `Gagal menyimpan dokumentasi: ${documentationError.message}`
          );
        }
      }

      router.push("/laporan");
      router.refresh();
    } catch (draftError) {
      console.error(
        "Gagal menyimpan draft:",
        draftError
      );

      setError(
        draftError instanceof
          Error
          ? draftError.message
          : "Terjadi kesalahan saat menyimpan draft."
      );

      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8"
    >
      {/* WAKTU & JUDUL */}
      <div className="flex flex-col gap-8 rounded-[2rem] bg-[#1b1f2d] p-6 shadow-xl sm:p-8">
        <div className="flex flex-col gap-3 border-b border-[#46464b]/30 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#adc6ff]">
              <EventIcon />
            </span>

            <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[#dfe1f5]">
              Waktu & Judul Kegiatan
            </h2>
          </div>

          <span className="w-fit rounded-full bg-[#252938] px-4 py-1.5 text-xs text-[#c7c6cb]">
            Wajib Diisi
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tanggal"
              className="text-sm text-[#c7c6cb]"
            >
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
              className="w-full rounded-2xl bg-[#252938] px-4 py-3 text-sm text-[#dfe1f5] outline-none transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#c7c6cb]">
              Jam Kerja / Durasi
            </label>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                value={form.jamMulai}
                onChange={(event) =>
                  updateField(
                    "jamMulai",
                    event.target.value
                  )
                }
                required
                disabled={isSaving}
                className="w-full rounded-2xl bg-[#252938] px-4 py-3 text-sm text-[#dfe1f5] outline-none transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
              />

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
                className="w-full rounded-2xl bg-[#252938] px-4 py-3 text-sm text-[#dfe1f5] outline-none transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="judul"
            className="text-sm text-[#c7c6cb]"
          >
            Judul Kegiatan
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
            placeholder="Contoh: Implementasi Autentikasi pada Dashboard"
            required
            disabled={isSaving}
            className="w-full rounded-2xl bg-[#252938] px-4 py-3 text-sm text-[#dfe1f5] outline-none placeholder:text-[#919095] transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
          />
        </div>
      </div>

      {/* DETAIL AKTIVITAS */}
      <div className="flex flex-col gap-8 rounded-[2rem] bg-[#1b1f2d] p-6 shadow-xl sm:p-8">
        <div className="flex items-center gap-3 border-b border-[#46464b]/30 pb-4">
          <span className="text-[#adc6ff]">
            <DescriptionIcon />
          </span>

          <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[#dfe1f5]">
            Detail Aktivitas
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="aktivitas"
              className="text-sm text-[#c7c6cb]"
            >
              Apa yang kamu kerjakan?
            </label>

            <span className="text-xs text-[#919095]">
              Wajib diisi
            </span>
          </div>

          <textarea
            id="aktivitas"
            value={form.aktivitas}
            onChange={(event) =>
              updateField(
                "aktivitas",
                event.target.value
              )
            }
            placeholder="Jelaskan secara detail langkah-langkah pekerjaan yang kamu lakukan hari ini..."
            required
            rows={5}
            disabled={isSaving}
            className="w-full resize-none rounded-2xl bg-[#252938] p-4 text-sm leading-6 text-[#dfe1f5] outline-none placeholder:text-[#919095] transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="hasil"
              className="text-sm text-[#c7c6cb]"
            >
              Apa hasil dari kegiatan ini?
            </label>

            <span className="text-xs text-[#919095]">
              Output / Deliverables
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
            placeholder="Contoh: Berhasil menyelesaikan modul login..."
            required
            rows={4}
            disabled={isSaving}
            className="w-full resize-none rounded-2xl bg-[#252938] p-4 text-sm leading-6 text-[#dfe1f5] outline-none placeholder:text-[#919095] transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="kendala"
              className="text-sm text-[#c7c6cb]"
            >
              Ada kendala? (Opsional)
            </label>

            <span className="text-xs text-[#919095]">
              Opsional
            </span>
          </div>

          <textarea
            id="kendala"
            value={form.kendala}
            onChange={(event) =>
              updateField(
                "kendala",
                event.target.value
              )
            }
            placeholder="Tuliskan jika ada kendala teknis atau non-teknis..."
            rows={3}
            disabled={isSaving}
            className="w-full resize-none rounded-2xl bg-[#252938] p-4 text-sm leading-6 text-[#dfe1f5] outline-none placeholder:text-[#919095] transition focus:ring-2 focus:ring-[#adc6ff] disabled:opacity-60"
          />
        </div>
      </div>

      {/* DOKUMENTASI */}
      <div className="flex flex-col gap-8 rounded-[2rem] bg-[#1b1f2d] p-6 shadow-xl sm:p-8">
        <div className="flex items-center gap-3 border-b border-[#46464b]/30 pb-4">
          <span className="text-[#adc6ff]">
            <MediaIcon />
          </span>

          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[#dfe1f5]">
              Dokumentasi
            </h2>

            <p className="mt-1 text-xs text-[#858793]">
              Opsional · Maksimal 6 foto
            </p>
          </div>
        </div>

        <div
          onClick={() =>
            !isSaving &&
            fileInputRef.current?.click()
          }
          onDragOver={(event) =>
            event.preventDefault()
          }
          onDrop={handleDrop}
          className={`group rounded-2xl border-2 border-dashed border-[#46464b] bg-[#252938]/50 p-10 text-center transition ${
            isSaving
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-[#adc6ff] hover:bg-[#252938]"
          }`}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0566d9] text-[#e6ecff] transition-transform group-hover:scale-110">
            <CloudUploadIcon />
          </div>

          <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-[#dfe1f5]">
            Tambahkan dokumentasi
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#c7c6cb]">
            Upload foto kegiatan PKL kamu.
            Seret & letakkan file di sini
            atau klik untuk memilih.
          </p>

          <span className="mt-4 inline-flex rounded-full bg-[#0f1320] px-4 py-1.5 text-xs text-[#919095]">
            PNG, JPG, WEBP hingga 10MB
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

        {selectedFiles.length >
          0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {selectedFiles.map(
              (
                selectedFile,
                index
              ) => (
                <div
                  key={`${selectedFile.file.name}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-[#46464b] bg-[#252938]"
                >
                  <img
                    src={
                      selectedFile.preview
                    }
                    alt={
                      selectedFile.file.name
                    }
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-[#090e1b]/85 px-2 py-2">
                    <p className="truncate text-xs text-[#dfe1f5]">
                      {
                        selectedFile.file
                          .name
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(
                      event
                    ) => {
                      event.stopPropagation();

                      if (
                        !isSaving
                      ) {
                        removeFile(
                          index
                        );
                      }
                    }}
                    disabled={
                      isSaving
                    }
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#93000a] text-[#ffdad6] shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Hapus ${selectedFile.file.name}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-5 py-4 text-sm leading-6 text-[#ffb4ab]"
        >
          {error}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex flex-col-reverse items-stretch justify-end gap-3 pb-8 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={
            handleSaveDraft
          }
          disabled={
            isSaving
          }
          className="rounded-full bg-[#252938] px-6 py-3.5 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#353948] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Menyimpan..."
            : "Simpan sebagai Draft"}
        </button>

        <button
          type="submit"
          disabled={
            isSaving
          }
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0566d9] px-8 py-3.5 text-sm font-semibold text-[#e6ecff] shadow-lg transition hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CheckIcon />

          <span>
            {isSaving
              ? "Mengirim..."
              : "Kirim Laporan"}
          </span>
        </button>
      </div>
    </form>
  );
}