"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="15"
        r="3"
      />
      <path d="m10.5 12.5 8-8" />
      <path d="m15 7 2 2" />
      <path d="m17 5 2 2" />
    </svg>
  );
}

function EyeIcon({
  visible,
}: {
  visible: boolean;
}) {
  if (visible) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle
          cx="12"
          cy="12"
          r="2.5"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A9.5 9.5 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.8" />
      <path d="M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6c1.1 0 2.1-.2 3-.5" />
      <path d="M9.9 9.9a2.5 2.5 0 0 0 3.5 3.5" />
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

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
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

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 3 19 6v5c0 4.8-3 8.2-7 10-4-1.8-7-5.2-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function ResetPasswordForm() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isRecovery, setIsRecovery] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeRecovery() {
      try {
        /*
         * Setelah /auth/callback berhasil,
         * session recovery sudah disimpan
         * oleh Supabase SSR.
         */
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (session) {
          setEmail(
            session.user.email ?? ""
          );

          setIsRecovery(true);
        }

        setIsLoading(false);
      } catch (initializeError) {
        console.error(
          "Gagal memeriksa session recovery:",
          initializeError
        );

        if (!mounted) {
          return;
        }

        setError(
          "Sesi reset password tidak dapat diperiksa."
        );

        setIsLoading(false);
      }
    }

    initializeRecovery();

    /*
     * Tetap dengarkan perubahan auth.
     *
     * PASSWORD_RECOVERY biasanya muncul
     * ketika client menerima session recovery.
     */
    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          if (!mounted) {
            return;
          }

          console.log(
            "AUTH EVENT:",
            event
          );

          if (
            event ===
              "PASSWORD_RECOVERY" ||
            session
          ) {
            if (session) {
              setEmail(
                session.user.email ?? ""
              );
            }

            setIsRecovery(true);
            setError("");
          }
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!newPassword) {
      setError(
        "Password baru wajib diisi."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password minimal 6 karakter."
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Konfirmasi password wajib diisi."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Konfirmasi password tidak cocok."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Pastikan session recovery
       * masih tersedia sebelum update password.
       */
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        setError(
          "Sesi reset password tidak ditemukan atau sudah kedaluwarsa. Silakan minta link reset password baru."
        );

        return;
      }

      const {
        error: updateError,
      } =
        await supabase.auth.updateUser({
          password:
            newPassword,
        });

      if (updateError) {
        console.error(
          "Gagal mengubah password:",
          updateError.message
        );

        setError(
          updateError.message
        );

        return;
      }

      setIsSuccess(true);
    } catch (submitError) {
      console.error(
        "Error update password:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Password gagal diperbarui."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasMinimumLength =
    newPassword.length >= 8;

  const hasUppercase =
    /[A-Z]/.test(newPassword);

  const hasLowercase =
    /[a-z]/.test(newPassword);

  const hasNumber =
    /[0-9]/.test(newPassword);

  const hasSpecial =
    /[@$!%*?&#^()_\-+={}[\]|]/.test(
      newPassword
    );

  const strengthScore =
    [
      hasMinimumLength,
      hasUppercase && hasLowercase,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length;

  const passwordMatches =
    confirmPassword.length > 0 &&
    newPassword ===
      confirmPassword;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1320] px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252938] text-[#adc6ff]">
            <span className="material-symbols-outlined animate-spin text-3xl">
              progress_activity
            </span>
          </div>

          <p className="mt-4 text-sm text-[#c7c6cb]">
            Memeriksa sesi reset password...
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0f1320] px-4 py-10 text-[#dfe1f5] sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#0566d9]/20 blur-[140px]" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[420px] rounded-full bg-[#4c1d95]/20 blur-[130px]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/[0.05] bg-[#1b1f2d]/90 p-7 shadow-2xl backdrop-blur-2xl sm:p-10">
            <div className="text-center">
              <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#252938] text-[#adc6ff]">
                <div className="absolute inset-0 rounded-full bg-[#0566d9]/25 blur-2xl" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#0566d9]/20">
                  <CheckIcon />
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-3 py-1.5 text-xs font-medium text-[#adc6ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#adc6ff]" />
                Password Diperbarui
              </span>

              <h1 className="mt-5 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
                Password Berhasil Diubah
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#c7c6cb] sm:text-base">
                Password akun kamu sudah berhasil
                diperbarui. Gunakan password baru
                tersebut saat masuk ke PKL Journal.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0566d9] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0566d9]/20 transition hover:bg-[#0b73ed] active:scale-[0.99]"
              >
                Kembali ke Login
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isRecovery) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0f1320] px-4 py-10 text-[#dfe1f5] sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#0566d9]/20 blur-[140px]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/[0.05] bg-[#1b1f2d]/90 p-7 shadow-2xl backdrop-blur-2xl sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#252938] text-[#ffb4ab]">
                <span className="material-symbols-outlined text-4xl">
                  link_off
                </span>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-3 py-1.5 text-xs font-medium text-[#ffb4ab]">
                Tautan Tidak Valid
              </span>

              <h1 className="mt-5 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
                Sesi Reset Tidak Valid
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#c7c6cb] sm:text-base">
                Tautan reset password tidak valid,
                sudah digunakan, atau sudah
                kedaluwarsa.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/lupa-password"
                  )
                }
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0566d9] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0566d9]/20 transition hover:bg-[#0b73ed] active:scale-[0.99]"
              >
                Minta Link Reset Baru
                <ArrowRightIcon />
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#adc6ff] transition hover:text-[#dfe1f5]"
              >
                <ArrowLeftIcon />
                Kembali ke Login
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f1320] px-4 py-10 text-[#dfe1f5] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#0566d9]/20 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[420px] rounded-full bg-[#4c1d95]/20 blur-[130px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-xl items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/[0.05] bg-[#1b1f2d]/90 shadow-2xl backdrop-blur-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-[#0566d9] via-[#7c3aed] to-[#0566d9]" />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 text-center">
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#0566d9]/25 blur-2xl" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0566d9] to-[#7c3aed] text-white shadow-xl shadow-[#0566d9]/20">
                  <span className="material-symbols-outlined text-3xl">
                    shield_lock
                  </span>
                </div>

                <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-[#1b1f2d] bg-[#0566d9] text-white">
                  <span className="material-symbols-outlined text-[13px]">
                    check
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-3 py-1.5 text-xs font-medium text-[#adc6ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#adc6ff]" />
                Tautan Terverifikasi
              </div>

              <h1 className="mt-5 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
                Atur Ulang Kata Sandi
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#c7c6cb] sm:text-base">
                Silakan buat kata sandi baru yang
                kuat untuk mengamankan kembali
                akses jurnal harian PKL Anda.
              </p>
            </div>

            {email && (
              <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.05] bg-[#252938]/70 p-4">
                <div className="min-w-0">
                  <p className="text-xs text-[#919095]">
                    Akun yang dipulihkan
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-[#dfe1f5]">
                    {email}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#0566d9]/15 px-3 py-1 text-xs font-medium text-[#adc6ff]">
                  Siswa Magang
                </span>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-2xl border border-[#ffb4ab]/20 bg-[#ffb4ab]/10 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-[#ffb4ab]">
                    error
                  </span>

                  <p className="text-sm leading-6 text-[#ffb4ab]">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="new-password"
                    className="text-sm font-medium text-[#dfe1f5]"
                  >
                    Kata Sandi Baru
                  </label>

                  <span className="text-[11px] text-[#919095]">
                    Wajib
                  </span>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#919095]">
                    <LockIcon />
                  </span>

                  <input
                    id="new-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    placeholder="Masukkan kata sandi baru"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-[#46464b]/50 bg-[#252938] py-3.5 pl-12 pr-12 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#737581] focus:border-[#0566d9] focus:ring-2 focus:ring-[#0566d9]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    disabled={isSubmitting}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-[#919095] transition hover:bg-[#303443] hover:text-[#dfe1f5]"
                  >
                    <EyeIcon
                      visible={
                        showPassword
                      }
                    />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {Array.from(
                    { length: 4 },
                    (_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index <
                          strengthScore
                            ? "bg-[#0566d9]"
                            : "bg-[#303443]"
                        }`}
                      />
                    )
                  )}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <PasswordRequirement
                    valid={
                      hasMinimumLength
                    }
                    text="Minimal 8 karakter"
                  />

                  <PasswordRequirement
                    valid={
                      hasUppercase &&
                      hasLowercase
                    }
                    text="Huruf besar & kecil"
                  />

                  <PasswordRequirement
                    valid={hasNumber}
                    text="Mengandung angka"
                  />

                  <PasswordRequirement
                    valid={hasSpecial}
                    text="Karakter khusus"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="confirm-password"
                    className="text-sm font-medium text-[#dfe1f5]"
                  >
                    Konfirmasi Kata Sandi
                  </label>

                  {passwordMatches && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#86efac]">
                      <CheckIcon />
                      Cocok
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#919095]">
                    <KeyIcon />
                  </span>

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Ulangi kata sandi baru"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl border bg-[#252938] py-3.5 pl-12 pr-12 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#737581] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      passwordMatches
                        ? "border-[#4ade80]/50 focus:border-[#4ade80] focus:ring-[#4ade80]/10"
                        : "border-[#46464b]/50 focus:border-[#0566d9] focus:ring-[#0566d9]/20"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) =>
                          !value
                      )
                    }
                    disabled={isSubmitting}
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi password"
                        : "Tampilkan konfirmasi password"
                    }
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-[#919095] transition hover:bg-[#303443] hover:text-[#dfe1f5]"
                  >
                    <EyeIcon
                      visible={
                        showConfirmPassword
                      }
                    />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#0566d9]/15 bg-[#0566d9]/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0566d9]/15 text-[#adc6ff]">
                    <ShieldIcon />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#dfe1f5]">
                      Keamanan Akun
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#c7c6cb]">
                      Gunakan kombinasi kata sandi
                      yang unik dan sulit ditebak.
                      Jangan gunakan kembali kata
                      sandi yang sama pada layanan
                      lain.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0566d9] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0566d9]/20 transition hover:bg-[#0b73ed] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      progress_activity
                    </span>

                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan Kata Sandi Baru
                    <ArrowRightIcon />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                disabled={isSubmitting}
                className="mx-auto flex items-center gap-2 text-sm text-[#adc6ff] transition hover:text-[#dfe1f5] disabled:opacity-50"
              >
                <ArrowLeftIcon />
                Batalkan dan Kembali ke Login
              </button>
            </form>

            <div className="mt-8 border-t border-white/[0.05] pt-6 text-center">
              <p className="text-xs leading-5 text-[#737581]">
                Mengalami kendala dengan akun?
                Hubungi Administrator Sekolah atau
                Pembimbing Lapangan.
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
          <p className="whitespace-nowrap text-[10px] tracking-wide text-[#5f616d]">
            Protokol Keamanan Autentikasi • PKL Journal Platform
          </p>
        </div>
      </div>
    </main>
  );
}

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs transition ${
        valid
          ? "text-[#86efac]"
          : "text-[#919095]"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid
            ? "bg-[#22c55e]/15"
            : "bg-[#303443]"
        }`}
      >
        {valid ? (
          <CheckIcon />
        ) : (
          <span className="h-1 w-1 rounded-full bg-current" />
        )}
      </span>

      {text}
    </div>
  );
}