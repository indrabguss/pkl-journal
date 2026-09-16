import Link from "next/link";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

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

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
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

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M20 11a8 8 0 1 0 1 5" />
      <path d="M20 4v7h-7" />
      <path d="M12 8v4l2.5 1.5" />
    </svg>
  );
}

export default function LupaPasswordPage() {
  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <header className="w-full border-b border-white/[0.04] bg-[#0f1320]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/login"
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0566d9]">
              <span className="material-symbols-outlined text-[18px] text-[#e6ecff]">
                auto_stories
              </span>
            </div>

            <span className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight text-[#dfe1f5]">
              PKL Journal
            </span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#adc6ff] transition hover:text-[#dfe1f5]"
          >
            <ArrowLeftIcon />
            Masuk
          </Link>
        </div>
      </header>

      <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[320px] w-[540px] -translate-x-1/2 rounded-full bg-[#0566d9]/20 blur-[130px]" />

        <div className="pointer-events-none absolute bottom-10 left-1/4 h-[260px] w-[380px] rounded-full bg-[#0f0030]/30 blur-[110px]" />

        <div className="relative z-10 w-full max-w-[480px]">
          <div className="rounded-[2rem] bg-[#1b1f2d]/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-[#0566d9]/30 blur-xl" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#252938] text-[#adc6ff] shadow-lg">
                  <ResetIcon />
                </div>
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#252938] px-3 py-1.5 text-xs font-medium text-[#adc6ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#adc6ff]" />
                Pemulihan Kredensial Akun
              </div>

              <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
                Lupa Password Akun?
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-[#c7c6cb] sm:text-base">
                Masukkan email yang terdaftar pada PKL Journal.
                Kami akan mengirimkan tautan aman untuk mengatur
                ulang password kamu.
              </p>
            </div>

            <div className="mt-8">
              <ForgotPasswordForm />
            </div>

            <div className="mt-8 border-t border-[#46464b]/30 pt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-[#adc6ff] transition hover:text-[#dfe1f5] hover:underline"
              >
                <ArrowLeftIcon />
                Ingat password? Masuk kembali
              </Link>
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#171b29] px-3 py-1.5 text-xs text-[#c7c6cb]">
              <LockIcon />
              PKL Journal Security
            </div>

            <p className="text-xs text-[#737581]">
              © 2026 PKL Journal. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </main>
  );
}