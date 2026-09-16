import Link from "next/link";

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function DashboardBottomCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0f1320] py-16">
      <div className="pointer-events-none absolute inset-0 bg-[#090e1b]" />

      <div className="pointer-events-none absolute bottom-[-8rem] left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#0566d9]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center gap-4 overflow-hidden rounded-[2rem] bg-[#1b1f2d] p-8 text-center sm:p-12">
          <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-[#090e1b] text-[#adc6ff]">
            <EditIcon />
          </div>

          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[#dfe1f5] sm:text-3xl">
            Belum mencatat kegiatan hari ini?
          </h2>

          <p className="max-w-xl text-sm leading-6 text-[#c7c6cb] sm:text-base">
            Jangan lupa untuk selalu mencatat progress pekerjaan dan
            mengunggah dokumentasi kegiatan PKL kamu agar terekam dengan baik
            oleh pembimbing.
          </p>

          <Link
            href="/laporan/buat"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#0566d9] px-6 py-3.5 text-sm font-medium text-[#e6ecff] shadow-md transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
          >
            <AddIcon />
            Buat Laporan Hari Ini
          </Link>
        </div>
      </div>
    </section>
  );
}