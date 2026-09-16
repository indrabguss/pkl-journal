"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isRecovery, setIsRecovery] =
    useState(false);
  const [isSuccess, setIsSuccess] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeRecovery() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setEmail(
          session.user.email ?? ""
        );
        setIsRecovery(true);
      }

      setIsLoading(false);
    }

    initializeRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (
          event === "PASSWORD_RECOVERY" ||
          session
        ) {
          setEmail(
            session?.user?.email ?? ""
          );
          setIsRecovery(true);
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
      setError("Password baru wajib diisi.");
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

    if (newPassword !== confirmPassword) {
      setError(
        "Konfirmasi password tidak cocok."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Sesi reset password tidak ditemukan atau sudah kedaluwarsa. Silakan minta link reset password baru."
        );
        return;
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        console.error(
          "Gagal mengubah password:",
          updateError.message
        );

        setError(updateError.message);
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

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <span className="material-symbols-outlined animate-spin text-3xl text-slate-400">
          progress_activity
        </span>

        <p className="mt-3 text-sm text-slate-500">
          Memeriksa sesi reset password...
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <span className="material-symbols-outlined text-3xl text-emerald-600">
            check
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Password berhasil diubah
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Password akun kamu sudah diperbarui.
            Silakan login menggunakan password baru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="material-symbols-outlined text-3xl text-red-600">
            link_off
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Tautan Tidak Valid
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Tautan reset password tidak valid,
            sudah digunakan, atau sudah kedaluwarsa.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push("/lupa-password")
          }
          className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Minta Link Reset Baru
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {email && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Reset password untuk
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {email}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined mt-0.5 text-red-600">
              error
            </span>

            <p className="text-sm leading-6 text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="new-password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Password Baru
        </label>

        <div className="relative">
          <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            lock
          </span>

          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            placeholder="Masukkan password baru"
            autoComplete="new-password"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Konfirmasi Password
        </label>

        <div className="relative">
          <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            lock_reset
          </span>

          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            placeholder="Ulangi password baru"
            autoComplete="new-password"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
            Simpan Password Baru
            <span className="material-symbols-outlined text-[20px]">
              check
            </span>
          </>
        )}
      </button>
    </form>
  );
}

