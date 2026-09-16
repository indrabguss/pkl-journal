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

  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setSuccess(false);

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setError(
        "Email wajib diisi."
      );
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
            redirectTo:
              redirectUrl,
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

            <div>
              <p className="font-medium text-[#dfe1f5]">
                Link reset sudah diproses
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
            <span className="mt-0.5 text-[#adc6ff]">
              <InfoIcon />
            </span>

            <p className="text-xs leading-5 text-[#858793]">
              Tautan reset hanya dapat digunakan melalui
              halaman pemulihan akun yang disediakan oleh
              PKL Journal. Gunakan link dari email terbaru.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setEmail("");
          }}
          className="w-full rounded-full bg-[#252938] px-5 py-3.5 text-sm font-medium text-[#dfe1f5] transition hover:bg-[#353948]"
        >
          Gunakan Email Lain
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/login")
          }
          className="w-full rounded-full bg-[#0566d9] px-5 py-3.5 text-sm font-semibold text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
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
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[#dfe1f5]"
          >
            Email Terdaftar
          </label>

          <span className="text-xs font-medium text-[#adc6ff]">
            Wajib
          </span>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#8d8f98]">
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
              setEmail(
                event.target.value
              );

              if (error) {
                setError("");
              }
            }}
            required
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#090e1b] py-3.5 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none placeholder:text-[#666975] transition focus:ring-2 focus:ring-[#0566d9]/40 disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="rounded-2xl bg-[#252938]/60 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-[#adc6ff]">
            <span className="material-symbols-outlined text-[21px]">
              verified_user
            </span>
          </span>

          <div>
            <p className="text-sm font-semibold text-[#dfe1f5]">
              Pemulihan Akun Aman
            </p>

            <p className="mt-1 text-xs leading-5 text-[#858793]">
              Setelah menerima email, kamu akan diarahkan
              kembali ke PKL Journal untuk membuat password baru.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-4 py-3 text-sm leading-5 text-[#ffb4ab]"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0566d9] px-6 py-4 text-sm font-semibold text-[#e6ecff] shadow-lg transition hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[19px]">
              progress_activity
            </span>

            <span>
              Mengirim...
            </span>
          </>
        ) : (
          <>
            <span>
              Kirim Link Reset Password
            </span>

            <ArrowIcon />
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

