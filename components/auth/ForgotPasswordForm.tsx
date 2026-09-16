"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

function MailIcon() {
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
        height="14"
        rx="2"
      />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.5 2.9 8.1 7 10 4.1-1.9 7-5.5 7-10V6l-7-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowIcon() {
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

export default function ForgotPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

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
          "NEXT_PUBLIC_SITE_URL belum dikonfigurasi."
        );
        return;
      }

      const siteUrl =
        configuredSiteUrl.replace(/\/+$/, "");

      /*
       * Password recovery menggunakan
       * authorization code / PKCE.
       *
       * Supabase akan mengirim code ke
       * /auth/callback, lalu callback akan
       * menukar code tersebut menjadi session.
       */
      const redirectUrl =
        `${siteUrl}/auth/callback?next=/reset-password`;

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
          "SUPABASE RESET ERROR RAW:",
          resetError
        );

        console.error(
          "SUPABASE RESET ERROR MESSAGE:",
          String(resetError.message)
        );

        console.error(
          "SUPABASE RESET ERROR STATUS:",
          String(resetError.status)
        );

        console.error(
          "SUPABASE RESET ERROR NAME:",
          String(resetError.name)
        );

        setError(
          `Gagal mengirim email: ${String(
            resetError.message
          )}`
        );

        return;
      }

      setSuccess(true);
    } catch (submitError) {
      console.error(
        "Gagal mengirim reset password:",
        submitError
      );

      setError(
        submitErrorMessage(submitError)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-[#6ee7b7]/20 bg-[#6ee7b7]/10 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6ee7b7]/15 text-[#6ee7b7]">
              <CheckIcon />
            </div>

            <div className="min-w-0">
              <p className="font-[family-name:var(--font-syne)] text-sm font-semibold text-[#dfe1f5]">
                Link reset sudah dikirim
              </p>

              <p className="mt-1 text-sm leading-6 text-[#a8aab4]">
                Periksa inbox atau folder spam email{" "}
                <span className="font-medium text-[#dfe1f5]">
                  {email}
                </span>{" "}
                untuk melanjutkan penggantian password.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#252938]/60 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0 text-[#adc6ff]">
              <InfoIcon />
            </span>

            <p className="text-xs leading-5 text-[#858793]">
              Gunakan link reset dari email terbaru agar
              proses pemulihan akun berjalan dengan benar.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setError("");
            setEmail("");
          }}
          className="w-full rounded-full bg-[#252938] px-5 py-3.5 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#353948] active:scale-[0.99]"
        >
          Gunakan Email Lain
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full rounded-full bg-[#0566d9] px-5 py-3.5 text-sm font-semibold text-[#e6ecff] shadow-lg shadow-[#0566d9]/10 transition hover:bg-[#adc6ff] hover:text-[#002e6a] active:scale-[0.99]"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* EMAIL */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[#dfe1f5]"
          >
            Email Terdaftar
          </label>

          <span className="rounded-full bg-[#0566d9]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#adc6ff]">
            Wajib
          </span>
        </div>

        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#7f8190] transition group-focus-within:text-[#adc6ff]">
            <MailIcon />
          </span>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="1234567890@pnb.ac.id"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (error) {
                setError("");
              }
            }}
            required
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-white/[0.04] bg-[#090e1b] py-3.5 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none placeholder:text-[#666975] transition duration-200 focus:border-[#0566d9]/40 focus:ring-2 focus:ring-[#0566d9]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="flex items-start gap-2 pt-1 text-xs leading-5 text-[#858793]">
          <span className="mt-0.5 shrink-0 text-[#7f8190]">
            <InfoIcon />
          </span>

          <span>
            Pastikan kamu masih memiliki akses ke email
            tersebut untuk menerima link pemulihan.
          </span>
        </div>
      </div>

      {/* SECURITY INFO */}
      <div className="rounded-2xl border border-white/[0.03] bg-[#252938]/60 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0566d9]/10 text-[#adc6ff]">
            <VerifiedIcon />
          </div>

          <div className="min-w-0">
            <p className="font-[family-name:var(--font-syne)] text-sm font-semibold text-[#dfe1f5]">
              Pemulihan Akun Aman
            </p>

            <p className="mt-1 text-xs leading-5 text-[#858793]">
              Setelah menerima email, kamu akan diarahkan
              kembali ke PKL Journal untuk membuat password
              baru.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-4 py-3.5 text-sm leading-5 text-[#ffb4ab]"
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0">
              <InfoIcon />
            </span>

            <span>{error}</span>
          </div>
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#0566d9] px-6 py-4 text-sm font-semibold text-[#e6ecff] shadow-lg shadow-[#0566d9]/15 transition duration-200 hover:bg-[#adc6ff] hover:text-[#002e6a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[19px]">
              progress_activity
            </span>

            <span>Mengirim...</span>
          </>
        ) : (
          <>
            <span>Kirim Link Reset Password</span>

            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </>
        )}
      </button>
    </form>
  );
}

function submitErrorMessage(
  submitError: unknown
) {
  return submitError instanceof Error
    ? submitError.message
    : "Gagal mengirim link reset password.";
}