"use client";

import { useEffect, useState } from "react";

type Attendance = {
  id: string;
  tanggal: string;
  waktu_masuk: string | null;
  waktu_pulang: string | null;
  status: string;
};

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

function LoginIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
      <path d="m10 8-4 4 4 4" />
      <path d="M6 12h10" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="m14 8 4 4-4 4" />
      <path d="M8 12h10" />
    </svg>
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function formatTime(value: string | null) {
  if (!value) return "--:--";

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export default function AttendanceCard() {
  const [attendance, setAttendance] =
    useState<Attendance | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAttendance() {
      try {
        const response = await fetch("/api/absensi", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Gagal mengambil data absensi."
          );
        }

        if (!cancelled) {
          setAttendance(result.absensi);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal mengambil data absensi."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAttendance(
    action: "masuk" | "pulang"
  ) {
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/absensi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Absensi gagal diproses."
        );
      }

      setAttendance(result.absensi);
    } catch (attendanceError) {
      setError(
        attendanceError instanceof Error
          ? attendanceError.message
          : "Absensi gagal diproses."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const today = new Date();

  return (
    <section className="w-full bg-[#0f1320] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#adc6ff]/10 bg-[#171b29] p-6 sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#0566d9]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0566d9]/15 text-[#adc6ff]">
                  <CheckIcon />
                </span>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#777984]">
                    Kehadiran Hari Ini
                  </p>

                  <h2 className="mt-1 font-[family-name:var(--font-syne)] text-xl font-semibold text-[#dfe1f5]">
                    {formatDate(today)}
                  </h2>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-[#ffb4ab]">
                  {error}
                </p>
              )}

              {!error && !isLoading && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-[#0f1320] px-4 py-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        attendance?.waktu_masuk
                          ? "bg-[#34d399]"
                          : "bg-[#777984]"
                      }`}
                    />

                    <span className="text-xs text-[#c7c6cb]">
                      {attendance?.waktu_masuk
                        ? "Sudah Absen"
                        : "Belum Absen"}
                    </span>
                  </div>

                  {attendance?.waktu_masuk && (
                    <div className="rounded-full bg-[#0f1320] px-4 py-2 text-xs text-[#c7c6cb]">
                      Masuk{" "}
                      <span className="font-medium text-[#dfe1f5]">
                        {formatTime(
                          attendance.waktu_masuk
                        )}
                      </span>
                    </div>
                  )}

                  {attendance?.waktu_pulang && (
                    <div className="rounded-full bg-[#0f1320] px-4 py-2 text-xs text-[#c7c6cb]">
                      Pulang{" "}
                      <span className="font-medium text-[#dfe1f5]">
                        {formatTime(
                          attendance.waktu_pulang
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {!attendance?.waktu_masuk && !isLoading && (
                <button
                  type="button"
                  onClick={() =>
                    handleAttendance("masuk")
                  }
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0566d9] px-6 py-3.5 text-sm font-semibold text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LoginIcon />
                  {isSubmitting
                    ? "Memproses..."
                    : "Absen Masuk"}
                </button>
              )}

              {attendance?.waktu_masuk &&
                !attendance?.waktu_pulang && (
                  <button
                    type="button"
                    onClick={() =>
                      handleAttendance("pulang")
                    }
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#252938] px-6 py-3.5 text-sm font-semibold text-[#dfe1f5] transition hover:bg-[#353948] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogoutIcon />
                    {isSubmitting
                      ? "Memproses..."
                      : "Absen Pulang"}
                  </button>
                )}

              {attendance?.waktu_masuk &&
                attendance?.waktu_pulang && (
                  <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[#34d399]/10 px-6 py-3.5 text-sm font-medium text-[#34d399]">
                    <CheckIcon />
                    Absensi Selesai
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}