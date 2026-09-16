"use client";

import Link from "next/link";
import { useState } from "react";

type UbahPasswordPageContentProps = {
  email: string;
};

type StrengthResult = {
  score: number;
  label: string;
};

function getPasswordStrength(password: string): StrengthResult {
  if (!password) {
    return {
      score: 0,
      label: "Belum diisi",
    };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = [
    "Lemah",
    "Cukup",
    "Kuat",
    "Sangat Kuat",
  ];

  return {
    score,
    label: labels[score - 1] ?? "Lemah",
  };
}

export default function UbahPasswordPageContent({
  email,
}: UbahPasswordPageContentProps) {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(newPassword);

  const passwordsMatch =
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!currentPassword) {
      setError("Password saat ini wajib diisi.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (newPassword === currentPassword) {
      setError(
        "Password baru harus berbeda dari password saat ini."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/profil/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ?? "Gagal mengubah password."
        );
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError(
        "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-6 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-5">
        <Link
          href="/profil"
          className="inline-flex w-fit items-center gap-2 text-sm text-[#c7c6cb] transition hover:text-[#dfe1f5]"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Kembali ke Profil
        </Link>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="font-[Syne] text-4xl font-bold tracking-tight text-[#dfe1f5] md:text-5xl">
              Keamanan akun & kata sandi.
            </h1>

            <p className="mt-3 max-w-xl text-base leading-7 text-[#c7c6cb]">
              Perbarui password secara berkala untuk menjaga
              keamanan data jurnal PKL kamu.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#252938] px-4 py-2 text-xs text-[#c7c6cb]">
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">
              verified_user
            </span>
            Sesi akun aktif
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="relative overflow-hidden rounded-3xl bg-[#171b29] p-6 shadow-xl md:p-8 lg:col-span-2">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0566d9]/10 blur-3xl" />

          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex flex-col gap-6"
          >
            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between text-sm font-medium text-[#dfe1f5]">
                <span>Password Saat Ini</span>

                <span className="text-xs text-[#777984]">
                  {email}
                </span>
              </label>

              <PasswordInput
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={showCurrent}
                onToggle={() =>
                  setShowCurrent((value) => !value)
                }
                placeholder="Masukkan password saat ini"
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dfe1f5]">
                Password Baru
              </label>

              <PasswordInput
                value={newPassword}
                onChange={setNewPassword}
                visible={showNew}
                onToggle={() =>
                  setShowNew((value) => !value)
                }
                placeholder="Minimal 8 karakter"
              />

              {/* Strength */}
              <div className="mt-1 flex flex-col gap-2">
                <div className="grid h-1.5 w-full grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map(
                    (_, index) => {
                      const active =
                        index < strength.score;

                      const strengthColor =
                        strength.score <= 1
                          ? "bg-[#ffb4ab]"
                          : strength.score === 2
                            ? "bg-[#f59e0b]"
                            : strength.score === 3
                              ? "bg-[#adc6ff]"
                              : "bg-[#6ee7b7]";

                      return (
                        <div
                          key={index}
                          className={`rounded-full transition-all ${
                            active
                              ? strengthColor
                              : "bg-[#303443]"
                          }`}
                        />
                      );
                    }
                  )}
                </div>

                <span className="text-xs text-[#919095]">
                  Kekuatan password:{" "}
                  <span className="text-[#c7c6cb]">
                    {strength.label}
                  </span>
                </span>
              </div>
            </div>

            {/* Confirm */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dfe1f5]">
                Konfirmasi Password Baru
              </label>

              <PasswordInput
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirm}
                onToggle={() =>
                  setShowConfirm((value) => !value)
                }
                placeholder="Ulangi password baru"
              />

              {confirmPassword && (
                <span
                  className={`text-xs ${
                    passwordsMatch
                      ? "text-[#6ee7b7]"
                      : "text-[#ffb4ab]"
                  }`}
                >
                  {passwordsMatch
                    ? "Password cocok."
                    : "Password tidak cocok."}
                </span>
              )}
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 rounded-2xl bg-[#1b1f2d] p-4 text-[#c7c6cb]">
              <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-[#adc6ff]">
                info
              </span>

              <p className="text-xs leading-6">
                Gunakan minimal 8 karakter dengan kombinasi
                huruf besar, huruf kecil, angka, dan simbol.
                Hindari informasi pribadi yang mudah ditebak.
              </p>
            </div>

            {/* Feedback */}
            {error && (
              <div className="rounded-2xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-4 py-3 text-sm text-[#ffb4ab]">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-2xl border border-[#6ee7b7]/20 bg-[#6ee7b7]/10 px-4 py-3 text-sm text-[#6ee7b7]">
                <span className="material-symbols-outlined text-[20px]">
                  check_circle
                </span>

                <div>
                  <p className="font-medium">
                    Password berhasil diperbarui.
                  </p>

                  <p className="mt-1 text-xs text-[#a7f3d0]">
                    Password baru sudah aktif untuk login
                    berikutnya.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#46464b]/30 pt-5 sm:flex-row sm:items-center sm:justify-end">
              <Link
                href="/profil"
                className="rounded-full px-6 py-3 text-center text-sm text-[#c7c6cb] transition hover:bg-[#252938] hover:text-[#dfe1f5]"
              >
                Kembali
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0566d9] px-7 py-3 text-sm font-medium text-[#e6ecff] shadow-md transition hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  lock_reset
                </span>

                {saving
                  ? "Memperbarui..."
                  : "Perbarui Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Tips */}
          <section className="rounded-3xl bg-[#171b29] p-6 shadow-xl">
            <h3 className="flex items-center gap-2 font-[Syne] text-lg font-semibold text-[#dfe1f5]">
              <span className="material-symbols-outlined text-[#adc6ff]">
                security
              </span>
              Tips Keamanan Akun
            </h3>

            <div className="mt-5 flex flex-col gap-4">
              <SecurityTip>
                Gunakan password yang panjang dan unik untuk
                akun PKL Journal.
              </SecurityTip>

              <SecurityTip>
                Jangan membagikan password kepada orang lain,
                termasuk sesama peserta PKL.
              </SecurityTip>

              <SecurityTip>
                Selalu logout setelah menggunakan perangkat
                publik atau komputer bersama.
              </SecurityTip>
            </div>
          </section>

          {/* Session */}
          <section className="rounded-3xl bg-[#171b29] p-6 shadow-xl">
            <h3 className="flex items-center gap-2 font-[Syne] text-lg font-semibold text-[#dfe1f5]">
              <span className="material-symbols-outlined text-[#adc6ff]">
                devices
              </span>
              Sesi Aktif Saat Ini
            </h3>

            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#1b1f2d] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0566d9]/20 text-[#adc6ff]">
                <span className="material-symbols-outlined">
                  computer
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[#dfe1f5]">
                  Sesi Perangkat Ini
                </p>

                <p className="mt-1 text-xs text-[#919095]">
                  Akun sedang aktif dan terautentikasi
                </p>
              </div>

              <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-[#6ee7b7]" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border-0 bg-[#1b1f2d] px-4 py-3.5 pr-12 text-sm text-[#dfe1f5] placeholder:text-[#777984] outline-none transition focus:ring-2 focus:ring-[#adc6ff]"
        autoComplete="off"
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#919095] transition hover:text-[#dfe1f5]"
        aria-label={
          visible
            ? "Sembunyikan password"
            : "Tampilkan password"
        }
      >
        <span className="material-symbols-outlined text-[20px]">
          {visible ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}

function SecurityTip({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px] text-[#adc6ff]">
        check_circle
      </span>

      <p className="text-sm leading-6 text-[#c7c6cb]">
        {children}
      </p>
    </div>
  );
}