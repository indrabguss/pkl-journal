import Link from "next/link";

type VerificationEmailPageProps = {
  email: string;
};

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
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

export default function VerificationEmailPage({
  email,
}: VerificationEmailPageProps) {
  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <div className="relative flex min-h-[calc(100vh-88px)] w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-[#adc6ff]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-[#895af4]/10 blur-[100px]" />

        <div className="relative z-10 w-full max-w-xl rounded-[2rem] bg-[#1b1f2d] p-6 text-center shadow-2xl sm:p-8 lg:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0566d9]/20 text-[#adc6ff] ring-1 ring-[#adc6ff]/30">
            <MailIcon />
          </div>

          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#0566d9]/20 px-4 py-1.5 text-xs font-medium text-[#adc6ff]">
            <span className="h-2 w-2 rounded-full bg-[#adc6ff]" />
            Menunggu Verifikasi
          </div>

          <h1 className="mt-5 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
            Cek Email Kamu
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#c7c6cb] sm:text-base">
            Link verifikasi akun sudah dikirim ke alamat email berikut.
          </p>

          <div className="mt-6 rounded-2xl bg-[#171b29] p-4">
            <p className="break-all text-sm font-medium text-[#adc6ff]">
              {email}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[#46464b]/30 bg-[#252938]/50 p-5 text-left">
            <p className="text-sm font-medium text-[#dfe1f5]">
              Langkah berikutnya
            </p>

            <ol className="mt-3 space-y-3 text-sm leading-6 text-[#9a9ca7]">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0566d9]/20 text-xs font-semibold text-[#adc6ff]">
                  1
                </span>

                <span>
                  Buka inbox email kamu.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0566d9]/20 text-xs font-semibold text-[#adc6ff]">
                  2
                </span>

                <span>
                  Cari email verifikasi dari PKL Journal / Supabase.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0566d9]/20 text-xs font-semibold text-[#adc6ff]">
                  3
                </span>

                <span>
                  Klik tombol atau link untuk mengaktifkan akun.
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-6 rounded-2xl border border-[#f59e0b]/10 bg-[#f59e0b]/5 px-4 py-3 text-left">
            <p className="text-xs leading-5 text-[#b9abb0]">
              Belum menerima email? Periksa folder Spam/Junk dan pastikan
              alamat email yang digunakan sudah benar.
            </p>
          </div>

          <Link
            href="/login"
            className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#0566d9] px-4 py-3.5 text-sm font-medium text-[#e6ecff] shadow-lg transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
          >
            <span>Kembali ke Login</span>

            <span className="transition-transform group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 px-4 pb-8 text-xs text-[#c7c6cb]/60">
        <LockIcon />
        <span>PKL Journal Security</span>
      </div>

      <footer className="w-full bg-[#171b29] px-6 py-7 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved. Platform Praktik Kerja
        Lapangan. By NgussDeveloper.
      </footer>
    </main>
  );
}