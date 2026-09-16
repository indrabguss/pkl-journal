"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Email wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const configuredSiteUrl =
        process.env.NEXT_PUBLIC_SITE_URL?.trim();

      if (!configuredSiteUrl) {
        setError(
          "NEXT_PUBLIC_SITE_URL belum dikonfigurasi. Periksa environment variable."
        );
        return;
      }

      const siteUrl =
        configuredSiteUrl.replace(/\/+$/, "");

      // Password recovery langsung diarahkan
      // ke halaman reset password production.
      const redirectUrl =
        `${siteUrl}/reset-password`;

      console.log(
        "Password reset redirect URL:",
        redirectUrl
      );

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo: redirectUrl,
          }
        );

      if (resetError) {
        console.error(
          "Gagal mengirim reset password:",
          resetError.message
        );

        setError(resetError.message);
        return;
      }

      setSuccess(true);
    } catch (submitError) {
      console.error(
        "Error reset password:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Permintaan reset password gagal diproses."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined mt-0.5 text-emerald-600">
              mark_email_read
            </span>

            <div>
              <h3 className="font-semibold text-emerald-900">
                Email reset password terkirim
              </h3>

              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Silakan cek email{" "}
                <span className="font-medium">
                  {email.trim()}
                </span>{" "}
                dan klik tombol reset password.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setEmail("");
          }}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Kirim ulang
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          Kembali ke halaman login
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
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
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <div className="relative">
          <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            mail
          </span>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Masukkan email kamu"
            autoComplete="email"
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
            Mengirim...
          </>
        ) : (
          <>
            Kirim Link Reset
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => router.push("/login")}
        className="w-full text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        Kembali ke login
      </button>
    </form>
  );
}
