"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
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

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
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

function EyeIcon({
  visible,
}: {
  visible: boolean;
}) {
  if (visible) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
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
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A10.6 10.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.9" />
      <path d="M6.2 6.2C3.9 7.8 2.5 12 2.5 12s3.5 6 9.5 6c1.3 0 2.5-.3 3.5-.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [remember, setRemember] =
    useState(false);

  const [error, setError] =
    useState("");

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

    const cleanEmail =
      email.trim();

    if (!cleanEmail || !password) {
      setError(
        "Email dan password wajib diisi."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        error: signInError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: cleanEmail,
            password,
          }
        );

      if (signInError) {
        if (
          signInError.message
            .toLowerCase()
            .includes(
              "email not confirmed"
            )
        ) {
          setError(
            "Email kamu belum diverifikasi. Silakan cek email dan klik link konfirmasi dari Supabase."
          );
        } else {
          setError(
            "Email atau password yang kamu masukkan salah."
          );
        }

        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (loginError) {
      console.error(
        "Login gagal:",
        loginError
      );

      setError(
        "Terjadi kesalahan saat proses login."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md py-8 sm:py-12 lg:py-16">
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
          Selamat datang kembali
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#c7c6cb]">
          Masukkan kredensial akun untuk mengakses jurnal PKL.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* EMAIL */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[#dfe1f5]"
          >
            Email
          </label>

          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-4 text-[#919095]">
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
              className="w-full rounded-full border border-transparent bg-[#0f1320] py-3.5 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none placeholder:text-[#919095] transition focus:border-[#adc6ff] focus:ring-2 focus:ring-[#0566d9]/30 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#dfe1f5]"
            >
              Password
            </label>

            {/* FIX: LINK AKTIF */}
            <Link
              href="/lupa-password"
              className="text-xs font-medium text-[#adc6ff] transition hover:text-[#dfe1f5] hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-4 text-[#919095]">
              <LockIcon />
            </span>

            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );

                if (error) {
                  setError("");
                }
              }}
              required
              disabled={isSubmitting}
              className="w-full rounded-full border border-transparent bg-[#0f1320] py-3.5 pl-12 pr-12 text-sm text-[#dfe1f5] outline-none placeholder:text-[#919095] transition focus:border-[#adc6ff] focus:ring-2 focus:ring-[#0566d9]/30 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              aria-label={
                showPassword
                  ? "Sembunyikan password"
                  : "Tampilkan password"
              }
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current
                )
              }
              className="absolute right-4 flex items-center text-[#919095] transition hover:text-[#dfe1f5]"
            >
              <EyeIcon
                visible={
                  showPassword
                }
              />
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-4 py-3 text-sm leading-5 text-[#ffb4ab]"
          >
            {error}
          </div>
        )}

        {/* REMEMBER */}
        <label className="flex cursor-pointer items-center gap-2 pt-1">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={remember}
            onChange={(event) =>
              setRemember(
                event.target.checked
              )
            }
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-[#46464b] bg-[#0f1320] accent-[#0566d9]"
          />

          <span className="text-sm text-[#c7c6cb]">
            Ingat perangkat ini
          </span>
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0566d9] px-4 py-3.5 text-sm font-semibold text-[#e6ecff] shadow-md transition hover:bg-[#adc6ff] hover:text-[#002e6a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>
            {isSubmitting
              ? "Memproses..."
              : "Masuk"}
          </span>

          {!isSubmitting && (
            <ArrowIcon />
          )}
        </button>
      </form>

      {/* REGISTER */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[#c7c6cb]">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-[#adc6ff] transition hover:text-[#dfe1f5] hover:underline"
          >
            Klik disini
          </Link>
        </p>
      </div>
    </div>
  );
}