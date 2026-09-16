import LoginForm from "./LoginForm";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left editorial section */}
        <section className="relative flex min-h-[620px] w-full flex-col justify-between overflow-hidden bg-[#090e1b] p-8 sm:p-10 lg:min-h-screen lg:w-1/2 lg:p-16">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#0566d9] blur-[120px]" />
            <div className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-[#0f0030] blur-[150px]" />
          </div>

          {/* Brand micro element */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#adc6ff]" />

            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#c7c6cb]">
              Secure Authentication Portal
            </span>
          </div>

          {/* Main editorial content */}
          <div className="relative z-10 my-auto max-w-xl py-16">
            <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold leading-tight tracking-tight text-[#dfe1f5] sm:text-5xl">
              Dokumentasikan setiap hari perjalanan PKL kamu.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#c7c6cb]">
              Satu tempat untuk mencatat aktivitas, menyimpan dokumentasi,
              dan melihat perjalanan PKL kamu dari hari ke hari.
            </p>

            {/* Feature cards */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#1b1f2d]/70 p-4 shadow-sm backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[#adc6ff]">
                  <CheckIcon />

                  <span className="text-sm font-medium text-[#dfe1f5]">
                    Daily Logs
                  </span>
                </div>

                <p className="text-xs leading-5 text-[#c7c6cb]">
                  Catat progres harian dengan format terstruktur.
                </p>
              </div>

              <div className="rounded-2xl bg-[#1b1f2d]/70 p-4 shadow-sm backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[#d0bcff]">
                  <FolderIcon />

                  <span className="text-sm font-medium text-[#dfe1f5]">
                    Media Vault
                  </span>
                </div>

                <p className="text-xs leading-5 text-[#c7c6cb]">
                  Simpan foto dan dokumen kerja secara aman.
                </p>
              </div>
            </div>
          </div>

          {/* Version */}
          <div className="relative z-10 text-xs text-[#919095]">
            v2.4.0-stable • PKL Journal Enterprise Architecture
          </div>
        </section>

        {/* Right login section */}
        <section className="flex w-full flex-1 flex-col justify-between bg-[#171b29] p-8 sm:p-10 lg:w-1/2 lg:p-16">
          <div />

          <LoginForm />

          <div className="border-t border-[#46464b]/30 pt-6 text-center text-xs text-[#919095] lg:text-left">
            PKL Journal — Personal Internship Journal
          </div>
        </section>
      </div>

      <footer className="bg-[#171b29] px-6 py-6 text-center text-xs text-[#919095]">
        © 2026 PKL Journal. All rights reserved. Platform Praktik Kerja
        Lapangan. By NgussDeveloper.
      </footer>
    </main>
  );
}