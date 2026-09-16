"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Profile = {
  nama: string | null;
  email: string | null;
  id_praktikan: string | null;
  program_studi: string | null;
  tempat_pkl: string | null;
  avatar_path: string | null;
};

type EditProfilPageContentProps = {
  profile: Profile;
  avatarUrl: string;
};

export default function EditProfilPageContent({
  profile,
  avatarUrl,
}: EditProfilPageContentProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nama, setNama] = useState(profile.nama ?? "");
  const [programStudi, setProgramStudi] = useState(
    profile.program_studi ?? ""
  );
  const [tempatPkl, setTempatPkl] = useState(
    profile.tempat_pkl ?? ""
  );

  const [previewUrl, setPreviewUrl] = useState(avatarUrl);
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  function handleSelectFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Format foto harus JPG, PNG, atau WebP."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2MB.");

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setRemoveAvatar(false);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  }

  function handleRemoveAvatar() {
    setSelectedFile(null);
    setRemoveAvatar(true);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!programStudi.trim()) {
      setError("Program studi wajib diisi.");
      return;
    }

    if (!tempatPkl.trim()) {
      setError("Tempat PKL wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Sesi login tidak ditemukan.");
        return;
      }

      let newAvatarPath = profile.avatar_path;

      // Hapus foto lama jika user memilih foto baru
      // atau menghapus foto.
      if (
        (selectedFile || removeAvatar) &&
        profile.avatar_path
      ) {
        const { error: removeError } =
          await supabase.storage
            .from("avatars")
            .remove([profile.avatar_path]);

        if (removeError) {
          console.error(
            "Gagal menghapus avatar lama:",
            removeError.message
          );
        }

        if (removeAvatar && !selectedFile) {
          newAvatarPath = null;
        }
      }

      // Upload foto baru.
      if (selectedFile) {
        const extension =
          selectedFile.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        const filePath = `${user.id}/avatar.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from("avatars")
            .upload(filePath, selectedFile, {
              cacheControl: "3600",
              upsert: true,
              contentType: selectedFile.type,
            });

        if (uploadError) {
          setError(
            `Gagal mengunggah foto: ${uploadError.message}`
          );
          return;
        }

        newAvatarPath = filePath;
      }

      // Update profile.
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          nama: nama.trim(),
          program_studi: programStudi.trim(),
          tempat_pkl: tempatPkl.trim(),
          avatar_path: newAvatarPath,
        })
        .eq("id", user.id);

      if (updateError) {
        setError(
          `Gagal menyimpan profil: ${updateError.message}`
        );
        return;
      }

      router.push("/profil");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Terjadi kesalahan saat menyimpan perubahan."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 md:py-16">
      {/* Top Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/profil"
          className="inline-flex items-center gap-2 text-sm text-[#c7c6cb] transition hover:text-[#dfe1f5]"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          Kembali ke Profil
        </Link>

        <div className="flex items-center gap-2 text-sm text-[#c7c6cb]">
          <span className="h-2 w-2 rounded-full bg-[#adc6ff]" />
          Mode Edit Aktif
        </div>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="font-[Syne] text-4xl font-bold tracking-tight text-[#dfe1f5] md:text-5xl">
          Perbarui informasi dirimu.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-[#c7c6cb]">
          Pastikan data diri, instansi tempat PKL, dan
          program studi selalu akurat untuk keperluan
          pelaporan resmi PKL Journal.
        </p>
      </div>

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#171b29] p-6 shadow-xl md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#adc6ff]/5 blur-3xl" />

        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex flex-col gap-10"
        >
          {/* FOTO PROFIL */}
          <section className="flex flex-col gap-6 border-b border-[#46464b]/30 pb-8 md:flex-row md:items-center">
            <div className="relative h-24 w-24 shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-[#303443]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={`Foto profil ${
                      profile.nama ?? "Pengguna"
                    }`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-[#c7c6cd]">
                      person
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#0566d9] text-white shadow-lg transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
                aria-label="Unggah foto"
              >
                <span className="material-symbols-outlined text-[18px]">
                  photo_camera
                </span>
              </button>
            </div>

            <div className="flex-1">
              <h3 className="font-[Syne] text-xl font-semibold text-[#dfe1f5]">
                Foto Profil
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#919095]">
                Format JPG, PNG atau WebP. Ukuran
                maksimal 2MB.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleSelectFile}
                className="hidden"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-5 py-2.5 text-sm text-[#dfe1f5] transition hover:bg-[#353948]"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    upload
                  </span>
                  Unggah Foto Baru
                </button>

                {(previewUrl || profile.avatar_path) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="rounded-full px-5 py-2.5 text-sm text-[#ffb4ab] transition hover:bg-[#93000a]/20"
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* FORM */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nama */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dfe1f5]">
                Nama Lengkap
              </label>

              <input
                type="text"
                value={nama}
                onChange={(event) =>
                  setNama(event.target.value)
                }
                className="rounded-2xl border border-[#46464b]/50 bg-[#1b1f2d] px-4 py-3 text-sm text-[#dfe1f5] outline-none transition focus:border-[#adc6ff]"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* ID Praktikan */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dfe1f5]">
                ID Praktikan
              </label>

              <input
                type="text"
                value={profile.id_praktikan ?? "-"}
                disabled
                className="cursor-not-allowed rounded-2xl border border-[#46464b]/30 bg-[#1b1f2d]/50 px-4 py-3 text-sm text-[#919095]"
              />

              <span className="text-xs text-[#777984]">
                ID Praktikan tidak dapat diubah secara
                mandiri.
              </span>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dfe1f5]">
                Email
              </label>

              <input
                type="email"
                value={profile.email ?? "-"}
                disabled
                className="cursor-not-allowed rounded-2xl border border-[#46464b]/30 bg-[#1b1f2d]/50 px-4 py-3 text-sm text-[#919095]"
              />

              <span className="text-xs text-[#777984]">
                Email akun tidak diubah dari halaman
                ini.
              </span>
            </div>

            {/* Program Studi */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dfe1f5]">
                Program Studi / Jurusan
              </label>

              <input
                type="text"
                value={programStudi}
                onChange={(event) =>
                  setProgramStudi(event.target.value)
                }
                className="rounded-2xl border border-[#46464b]/50 bg-[#1b1f2d] px-4 py-3 text-sm text-[#dfe1f5] outline-none transition focus:border-[#adc6ff]"
                placeholder="Masukkan program studi"
              />
            </div>

            {/* Tempat PKL */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-[#dfe1f5]">
                Tempat PKL / Instansi
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={tempatPkl}
                  onChange={(event) =>
                    setTempatPkl(event.target.value)
                  }
                  className="w-full rounded-2xl border border-[#46464b]/50 bg-[#1b1f2d] px-4 py-3 pr-12 text-sm text-[#dfe1f5] outline-none transition focus:border-[#adc6ff]"
                  placeholder="Masukkan tempat PKL"
                />

                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-[#919095]">
                  domain
                </span>
              </div>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="rounded-2xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-4 py-3 text-sm text-[#ffb4ab]">
              {error}
            </div>
          )}

          {/* ACTION */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#46464b]/30 pt-6 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/profil"
              className="rounded-full px-6 py-3 text-center text-sm text-[#c7c6cb] transition hover:bg-[#252938] hover:text-[#dfe1f5]"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0566d9] px-7 py-3 text-sm font-medium text-[#e6ecff] shadow-lg transition hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                save
              </span>

              {saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}