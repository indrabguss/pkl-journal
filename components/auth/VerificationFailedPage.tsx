import Link from "next/link";

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
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
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M20 11a8 8 0 1 0 1 4" />
      <path d="M20 4v7h-7" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4.5 1.5c-.9 1.1-2 1.4-2 2.8" />
      <path d="M12 17h.01" />
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
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function VerificationFailedPage() {
  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <div className="relative flex min-h-[calc(100vh-88px)] w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-[#adc6ff]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-[#895af4]/10 blur-[100px]" />

        {/* Failure Card */}
        <div className="relative z-10 flex w-full max-w-xl flex-col items-center rounded-[2rem] bg-[#1b1f2d] p-6 text-center shadow-2xl sm:p-8 lg:p-12">
          {/* Error icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#93000a]/20 text-[#ffb4ab] ring-1 ring-[#ffb4ab]/30">
            <ErrorIcon />
          </div>

          {/* Status */}
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#93000a]/20 px-4 py-1.5 text-xs font-medium text-[#ffb4ab]">
            <span className="h-2 w-2 rounded-full bg-[#ffb4ab]" />
            Status: Verifikasi Gagal
          </div>

          {/* Heading */}
          <h1 className="max-w-lg font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
            Verifikasi Akun Tidak Berhasil
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-md text-sm leading-6 text-[#c7c6cb] sm:text-base">
            Kami belum dapat memverifikasi akun kamu. Tautan verifikasi
            mungkin sudah kedaluwarsa atau terjadi kesalahan saat proses
            konfirmasi email.
          </p>

          {/* Error detail */}
          <div className="mt-8 w-full rounded-2xl border border-[#46464b]/50 bg-[#171b29] p-4 text-left">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-[#c7c6cb]">
              Yang Bisa Kamu Lakukan
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="mt-0.5 text-[#adc6ff]">01</span>
                <p className="text-sm leading-5 text-[#c7c6cb]">
                  Pastikan kamu membuka tautan verifikasi terbaru dari email.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="mt-0.5 text-[#adc6ff]">02</span>
                <p className="text-sm leading-5 text-[#c7c6cb]">
                  Cek kembali koneksi internet dan coba proses verifikasi
                  sekali lagi.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="mt-0.5 text-[#adc6ff]">03</span>
                <p className="text-sm leading-5 text-[#c7c6cb]">
                  Hubungi pembimbing lapangan jika masalah masih terjadi.
                </p>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <Link
            href="/register"
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0566d9] px-4 py-3.5 text-sm font-medium text-[#e6ecff] shadow-lg transition-all duration-300 hover:bg-[#adc6ff] hover:text-[#002e6a]"
          >
            <RefreshIcon />
            <span>Coba Verifikasi Lagi</span>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#46464b] bg-transparent px-4 py-3.5 text-sm font-medium text-[#dfe1f5] transition-all hover:bg-[#252938]"
          >
            <span>Kembali ke Login</span>
            <ArrowIcon />
          </Link>

          {/* Help */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#c7c6cb]">
            <span className="text-[#919095]">
              <HelpIcon />
            </span>

            <span>
              Butuh bantuan?{" "}
              <a
                href="#"
                className="text-[#adc6ff] hover:underline"
              >
                Hubungi pembimbing lapangan.
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 px-4 pb-8 text-xs text-[#c7c6cb]/60">
        <LockIcon />
        <span>Enskripsi End-to-End • PKL Journal Security</span>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#171b29] px-6 py-7 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved. Platform Praktik Kerja
        Lapangan. By NgussDeveloper.
      </footer>
    </main>
  );
}