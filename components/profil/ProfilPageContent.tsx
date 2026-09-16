"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  nama: string | null;
  email: string | null;
  id_praktikan: string | null;
  program_studi: string | null;
  tempat_pkl: string | null;
  avatar_path: string | null;
  created_at: string;
};

type ProfilPageContentProps = {
  profile: Profile;
  userEmail: string;
  totalLaporan: number;
  totalDokumentasi: number;
  totalHariAbsensi: number;
  avatarUrl: string;
};

export default function ProfilPageContent({
  profile,
  userEmail,
  totalLaporan,
  totalDokumentasi,
  totalHariAbsensi,
  avatarUrl,
}: ProfilPageContentProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleLogout() {
    setMessage("");

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error ??
            "Gagal keluar dari sesi."
        );
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setMessage(
        "Terjadi kesalahan saat keluar dari sesi."
      );
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <section className="relative overflow-hidden bg-[#090e1b] px-6 pb-12 pt-12 md:pt-16">
        <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#adc6ff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0566d9]/20 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#252938] px-4 py-2 text-xs uppercase tracking-wider text-[#c7c6cb]">
              <span className="material-symbols-outlined text-[16px]">
                fingerprint
              </span>

              Identitas Praktikan
            </div>

            <h1 className="font-[Syne] text-4xl font-bold tracking-tight text-[#dfe1f5] md:text-5xl">
              Tentang perjalanan PKL kamu.
            </h1>

            <p className="mt-3 text-base leading-7 text-[#c7c6cb]">
              Arsip digital dan rekam jejak pelaksanaan
              Praktik Kerja Lapangan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/profil/edit"
              className="inline-flex items-center gap-2 rounded-full bg-[#0566d9] px-6 py-3 text-sm font-medium text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>

              Edit Profil
            </Link>

            <Link
              href="/profil/password"
              className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-6 py-3 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#353948]"
            >
              <span className="material-symbols-outlined text-[18px]">
                lock_reset
              </span>

              Ubah Password
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 pt-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <section className="relative overflow-hidden rounded-3xl bg-[#171b29] p-8 text-center shadow-xl">
            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#adc6ff]/10 px-3 py-1 text-xs text-[#adc6ff]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#adc6ff]" />
              Aktif
            </div>

            <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-[#adc6ff] to-[#d0bcff] p-1">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#303443]">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`Foto profil ${
                      profile.nama ?? "Pengguna"
                    }`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-[#c7c6cd]">
                    person
                  </span>
                )}
              </div>
            </div>

            <h2 className="font-[Syne] text-3xl font-bold text-[#dfe1f5]">
              {profile.nama || "Pengguna"}
            </h2>

            <p className="mt-1 text-sm text-[#adc6ff]">
              {profile.program_studi ||
                "Program Studi belum diisi"}
            </p>

            <div className="mt-7 space-y-4 border-t border-[#46464b]/40 pt-5 text-left">
              <InfoRow
                icon="mail"
                label="Email"
                value={
                  profile.email ||
                  userEmail ||
                  "-"
                }
              />

              <InfoRow
                icon="apartment"
                label="Tempat PKL"
                value={
                  profile.tempat_pkl ||
                  "-"
                }
              />

              <InfoRow
                icon="badge"
                label="ID Praktikan"
                value={
                  profile.id_praktikan ||
                  "-"
                }
                mono
              />
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl bg-[#171b29] p-8">
            <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-5">
              <span className="material-symbols-outlined text-[150px]">
                format_quote
              </span>
            </div>

            <span className="block text-xs uppercase tracking-wider text-[#adc6ff]">
              Catatan Pribadi
            </span>

            <blockquote className="mt-3 font-[Syne] text-xl font-semibold italic leading-8 text-[#dfe1f5]">
              “Setiap hari punya cerita. Setiap kegiatan punya
              proses.”
            </blockquote>

            <p className="mt-4 text-sm leading-7 text-[#c7c6cb]">
              Dokumentasikan setiap aktivitas, proses,
              dan hasil selama perjalanan PKL agar seluruh
              progres tersimpan dengan rapi.
            </p>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon="today"
              label="Hari Hadir"
              value={totalHariAbsensi}
              text="Absensi tercatat"
            />

            <StatCard
              icon="description"
              label="Total Laporan"
              value={totalLaporan}
              text="Laporan tersimpan"
            />

            <StatCard
              icon="photo_library"
              label="Dokumentasi"
              value={totalDokumentasi}
              text="Foto & lampiran"
            />
          </div>

          <section className="rounded-3xl bg-[#171b29] p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-[Syne] text-xl font-semibold text-[#dfe1f5]">
                Informasi PKL
              </h3>

              <span className="text-xs text-[#777984]">
                Data Praktikan
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox
                icon="school"
                label="Program Studi"
                value={
                  profile.program_studi ||
                  "-"
                }
              />

              <InfoBox
                icon="apartment"
                label="Instansi PKL"
                value={
                  profile.tempat_pkl ||
                  "-"
                }
              />
            </div>
          </section>

          <section className="flex flex-col justify-between gap-5 rounded-3xl bg-[#171b29] p-8 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-[Syne] text-xl font-semibold text-[#dfe1f5]">
                Pengaturan Akun & Sesi
              </h3>

              <p className="mt-1 text-sm text-[#c7c6cb]">
                Keluar dari perangkat atau akhiri
                sesi aktif saat ini.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#93000a] px-6 py-3 text-sm font-medium text-[#ffdad6] transition hover:bg-[#ffb4ab] hover:text-[#690005]"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>

              Keluar
            </button>
          </section>

          {message && (
            <div className="rounded-2xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-5 py-4 text-sm text-[#ffb4ab]">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="flex shrink-0 items-center gap-2 text-xs text-[#919095]">
        <span className="material-symbols-outlined text-[16px]">
          {icon}
        </span>

        {label}
      </span>

      <span
        className={`max-w-[65%] text-right text-sm font-medium text-[#dfe1f5] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  text,
}: {
  icon: string;
  label: string;
  value: number;
  text: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#171b29] p-6 transition hover:bg-[#1b1f2d]">
      <span className="material-symbols-outlined absolute right-5 top-5 text-3xl text-[#adc6ff]/30">
        {icon}
      </span>

      <span className="text-xs uppercase tracking-wider text-[#919095]">
        {label}
      </span>

      <div className="mt-2 font-[Syne] text-4xl font-bold text-[#dfe1f5]">
        {value}
      </div>

      <div className="mt-5 text-xs text-[#adc6ff]">
        {text}
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-[#1b1f2d] p-5">
      <div className="rounded-full bg-[#0566d9] p-3 text-[#e6ecff]">
        <span className="material-symbols-outlined text-[20px]">
          {icon}
        </span>
      </div>

      <div className="min-w-0">
        <span className="block text-xs text-[#919095]">
          {label}
        </span>

        <span className="mt-1 block break-words text-sm font-medium text-[#dfe1f5]">
          {value}
        </span>
      </div>
    </div>
  );
}