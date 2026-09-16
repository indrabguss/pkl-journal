import Link from "next/link";
import RegisterForm from "./RegisterForm";

function VerifiedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3 14.2 5l3-.2.9 2.8 2.4 1.8-1.2 2.8.8 2.9-2.7 1.3-1.1 2.8-3-.6L12 21l-2.3-2.2-3 .6-1.1-2.8-2.7-1.3.8-2.9-1.2-2.8 2.4-1.8.9-2.8 3 .2L12 3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="m13.2 2-8 11h5.4L9.8 22l8.9-13h-5.3L13.2 2Z" />
    </svg>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
        {/* LEFT */}
        <section className="relative flex min-h-[640px] flex-col justify-between overflow-hidden bg-[#171b29] p-6 sm:p-8 lg:col-span-5 lg:min-h-0 lg:p-12 xl:p-16">
          {/* Ambient decoration */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#adc6ff]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#d0bcff]/10 blur-3xl" />

          {/* Editorial */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#252938] px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#adc6ff]" />

              <span className="text-xs font-medium uppercase tracking-wider text-[#adc6ff]">
                PKL Journal OS v2.4
              </span>
            </div>

            <h1 className="mt-4 max-w-xl font-[family-name:var(--font-syne)] text-3xl font-bold leading-tight tracking-tight text-[#dfe1f5] sm:text-4xl xl:text-5xl">
              Mulai perjalanan PKL kamu dengan akun terverifikasi.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#c7c6cb] sm:text-base">
              Daftarkan akun PKL Journal kamu untuk mencatat aktivitas harian,
              dokumentasi, dan laporan resmi secara presisi dan real-time.
            </p>
          </div>

          {/* Features */}
          <div className="relative z-10 my-10 space-y-4 lg:my-0">
            <div className="rounded-2xl bg-[#1b1f2d] p-4 shadow-sm transition-transform duration-300 hover:translate-x-1">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0566d9] text-[#e6ecff]">
                  <VerifiedIcon />
                </div>

                <div>
                  <h3 className="font-[family-name:var(--font-syne)] text-base font-semibold text-[#dfe1f5] sm:text-lg">
                    Validasi Instansi
                  </h3>

                  <p className="text-xs leading-4 text-[#c7c6cb]">
                    Terhubung langsung dengan pembimbing lapangan.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#1b1f2d] p-4 shadow-sm transition-transform duration-300 hover:translate-x-1">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f0030] text-[#895af4]">
                  <BoltIcon />
                </div>

                <div>
                  <h3 className="font-[family-name:var(--font-syne)] text-base font-semibold text-[#dfe1f5] sm:text-lg">
                    Log Aktivitas Instan
                  </h3>

                  <p className="text-xs leading-4 text-[#c7c6cb]">
                    Catat tugas harian dengan unggahan lampiran kilat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="relative z-10 text-xs text-[#c7c6cb]">
            Si vis amari ama.
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex min-h-[640px] items-center justify-center bg-[#0f1320] px-6 py-10 sm:px-8 lg:col-span-7 lg:min-h-0 lg:px-12 lg:py-12 xl:px-16">
          <div className="w-full max-w-xl rounded-2xl bg-[#090e1b] p-6 shadow-xl sm:p-8 lg:p-10">
            <div className="mb-7">
              <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-[#dfe1f5] lg:text-4xl">
                Daftar Akun PKL
              </h2>

              <p className="mt-1 text-sm text-[#c7c6cb]">
                Lengkapi data diri Anda di bawah ini untuk memulai.
              </p>
            </div>

            <RegisterForm />

            <div className="mt-7 text-center">
              <p className="text-sm text-[#c7c6cb]">
                Sudah punya akun?
                <Link
                  href="/login"
                  className="ml-1 font-medium text-[#adc6ff] transition hover:text-[#dfe1f5] hover:underline"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="w-full bg-[#171b29] px-6 py-7 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved. Platform Praktik Kerja
        Lapangan. By NgussDeveloper.
      </footer>
    </main>
  );
}