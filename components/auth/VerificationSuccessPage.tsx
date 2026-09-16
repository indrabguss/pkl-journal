import Link from "next/link";

type VerificationSuccessPageProps = {
  nama: string;
  email: string;
  tempatPkl: string;
};

function VerifiedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 3 14.2 5l3-.2.9 2.8 2.4 1.8-1.2 2.8.8 2.9-2.7 1.3-1.1 2.8-3-.6L12 21l-2.3-2.2-3 .6-1.1-2.8-2.7-1.3.8-2.9-1.2-2.8 2.4-1.8.9-2.8 3 .2L12 3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
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
      <path d="m13 6 6-6-6-6" />
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

export default function VerificationSuccessPage({
  nama,
  email,
  tempatPkl,
}: VerificationSuccessPageProps) {
  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <div className="relative flex min-h-[calc(100vh-88px)] w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-[#adc6ff]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-[#895af4]/10 blur-[100px]" />

        <div className="relative z-10 flex w-full max-w-xl flex-col items-center rounded-[2rem] bg-[#1b1f2d] p-6 text-center shadow-2xl sm:p-8 lg:p-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0566d9]/20 text-[#adc6ff] ring-1 ring-[#adc6ff]/30">
            <VerifiedIcon />
          </div>

          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#0566d9]/30 px-4 py-1.5 text-xs font-medium text-[#adc6ff]">
            <span className="h-2 w-2 rounded-full bg-[#adc6ff]" />
            Status: Terverifikasi Aktif
          </div>

          <h1 className="max-w-lg font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] sm:text-4xl">
            Akun Kamu Berhasil Terverifikasi!
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-[#c7c6cb] sm:text-base">
            Selamat, email dan identitas instansi kamu telah dikonfirmasi.
            Sekarang kamu dapat mengakses seluruh fitur PKL Journal untuk
            mencatat dan mendokumentasikan perjalanan magangmu.
          </p>

          <div className="mt-8 w-full rounded-2xl bg-[#171b29] p-4 text-left">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-[#c7c6cb]">
              Informasi Pengguna
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 border-b border-[#46464b]/30 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-[#c7c6cb]">
                  Nama Lengkap
                </span>

                <span className="text-sm font-medium text-[#dfe1f5] sm:text-right">
                  {nama}
                </span>
              </div>

              <div className="flex flex-col gap-1 border-b border-[#46464b]/30 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-[#c7c6cb]">
                  Email Institusi
                </span>

                <span className="break-all text-sm font-medium text-[#adc6ff] sm:text-right">
                  {email}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-[#c7c6cb]">
                  Instansi Penempatan
                </span>

                <span className="text-sm font-medium text-[#dfe1f5] sm:text-right">
                  {tempatPkl}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0566d9] px-4 py-3.5 text-sm font-medium text-[#e6ecff] shadow-lg transition-all duration-300 hover:bg-[#adc6ff] hover:text-[#002e6a]"
          >
            <span>Masuk ke Dashboard Sekarang</span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>

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

      <div className="flex items-center justify-center gap-2 px-4 pb-8 text-xs text-[#c7c6cb]/60">
        <LockIcon />
        <span>Enskripsi End-to-End • PKL Journal Security</span>
      </div>

      <footer className="w-full bg-[#171b29] px-6 py-7 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved. Platform Praktik Kerja
        Lapangan. By NgussDeveloper.
      </footer>
    </main>
  );
}