"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Requirement = {
  label: string;
  valid: boolean;
};

export default function ResetPasswordForm() {
  const supabase = useMemo(() => createClient(), []);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const requirements: Requirement[] = [
    {
      label: "Minimal 8 karakter",
      valid: newPassword.length >= 8,
    },
    {
      label: "Huruf besar & huruf kecil",
      valid: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
    },
    {
      label: "Mengandung angka (0-9)",
      valid: /[0-9]/.test(newPassword),
    },
    {
      label: "Karakter khusus (@$!%*?&)",
      valid: /[@$!%*?&#^()_\-+=\[\]{}|]/.test(newPassword),
    },
  ];

  const score = requirements.filter((item) => item.valid).length;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const allRequirementsMet = score === 4;

  const strength = (() => {
    if (!newPassword) {
      return {
        label: "Kekuatan: Belum diisi",
        className: "text-[#919095]",
      };
    }

    if (score <= 1) {
      return {
        label: "Kekuatan: Lemah",
        className: "text-[#ffb4ab]",
      };
    }

    if (score === 2) {
      return {
        label: "Kekuatan: Sedang",
        className: "text-amber-400",
      };
    }

    if (score === 3) {
      return {
        label: "Kekuatan: Kuat",
        className: "text-[#adc6ff]",
      };
    }

    return {
      label: "Kekuatan: Sangat Kuat",
      className: "text-[#adc6ff] font-semibold",
    };
  })();

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setHasSession(true);
        setEmail(session.user.email ?? "");
      } else {
        setHasSession(false);
      }

      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setHasSession(true);
        setEmail(session.user.email ?? "");
      } else {
        setHasSession(false);
      }

      setCheckingSession(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!hasSession) {
      setErrorMessage(
        "Sesi reset password tidak ditemukan. Silakan minta tautan reset password baru."
      );
      return;
    }

    if (!allRequirementsMet) {
      setErrorMessage(
        "Kata sandi belum memenuhi seluruh persyaratan keamanan."
      );
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Gagal mengubah password:", error.message);
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5] flex items-center justify-center px-6">
        <div className="text-sm text-[#c7c6cb]">
          Memeriksa tautan reset password...
        </div>
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5] flex items-center justify-center px-6">
        <div className="w-full max-w-xl bg-[#171b29] rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0566d9] via-[#adc6ff] to-[#d0bcff]" />

          <div className="w-14 h-14 mx-auto rounded-full bg-[#303443] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#ffb4ab] text-[28px]">
              link_off
            </span>
          </div>

          <h1 className="font-[Syne] text-[30px] md:text-[36px] font-bold tracking-tight mt-5">
            Tautan Tidak Valid
          </h1>

          <p className="mt-3 text-sm md:text-base text-[#c7c6cb] leading-relaxed">
            Sesi reset password tidak ditemukan atau tautannya
            sudah tidak dapat digunakan.
          </p>

          <Link
            href="/lupa-password"
            className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0566d9] to-[#0f0030] text-white font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">
              lock_reset
            </span>
            Minta Tautan Baru
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="dark min-h-screen bg-[#0f1320] text-[#dfe1f5] flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#090e1b]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
        <div className="h-16 w-full px-6 md:px-8 flex items-center justify-between">
          <Link
            href="/login"
            className="flex items-center gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0566d9] to-[#d0bcff] flex items-center justify-center shadow-[0_0_12px_rgba(5,102,217,0.35)]">
              <span className="material-symbols-outlined text-white text-[18px]">
                auto_stories
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-[Syne] text-[18px] tracking-tight font-bold leading-none">
                PKL Journal
              </span>

              <span className="text-[12px] text-[#c7c6cb] leading-tight">
                Praktik Kerja Lapangan
              </span>
            </div>
          </Link>

          <div className="w-8 h-8 rounded-full bg-[#c7c6cd] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#2f3036] text-[18px]">
              person
            </span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full pt-16 flex-1 flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-b from-[#090e1b] via-[#0f1320] to-[#0f1320]">
        <div className="relative w-full max-w-xl mx-auto my-auto">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#0566d9]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute -bottom-20 -right-16 w-72 h-72 bg-[#d0bcff]/10 rounded-full blur-3xl pointer-events-none" />

          {/* CARD */}
          <div className="w-full bg-[#171b29]/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-8 md:p-12 flex flex-col gap-8 relative overflow-hidden">
            {/* Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0566d9] via-[#adc6ff] to-[#d0bcff] opacity-90" />

            {/* HEADER CARD */}
            <div className="flex flex-col items-center text-center gap-3">
              {/* Shield */}
              <div className="relative flex items-center justify-center mb-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0566d9] to-[#d0bcff] flex items-center justify-center shadow-[0_0_24px_rgba(5,102,217,0.45)]">
                  <span className="material-symbols-outlined text-white text-[28px]">
                    shield_lock
                  </span>
                </div>

                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#090e1b] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#adc6ff] text-[14px]">
                    check_circle
                  </span>
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#252938] text-[#adc6ff]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]" />
                <span className="text-[12px] tracking-wide uppercase font-semibold">
                  Tautan Terverifikasi
                </span>
              </div>

              {/* Title */}
              <h1 className="font-[Syne] text-[30px] md:text-[36px] text-[#dfe1f5] font-bold tracking-tight mt-1">
                Atur Ulang Kata Sandi
              </h1>

              <p className="text-[14px] leading-5 text-[#c7c6cb] max-w-md">
                Silakan buat kata sandi baru yang kuat untuk
                mengamankan kembali akses jurnal harian PKL Anda.
              </p>

              {/* Account */}
              <div className="w-full mt-1 py-2 px-4 rounded-xl bg-[#1b1f2d] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#c7c6cb] text-[18px]">
                    badge
                  </span>

                  <span className="text-[12px] text-[#c7c6cb] truncate">
                    Akun:{" "}
                    <span className="text-[#dfe1f5] font-medium">
                      {email || "Akun pengguna"}
                    </span>
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-[#252938] text-[#d8e2ff] text-[11px] font-medium shrink-0 whitespace-nowrap">
                  Siswa Magang
                </span>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              {/* NEW PASSWORD */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-[#dfe1f5] flex items-center justify-between"
                >
                  <span>Kata Sandi Baru</span>

                  <span className={`text-[12px] ${strength.className}`}>
                    {strength.label}
                  </span>
                </label>

                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-[#c7c6cb] pointer-events-none text-[20px]">
                    lock
                  </span>

                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-[#1b1f2d] text-[#dfe1f5] placeholder:text-[#46464b] rounded-2xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:bg-[#252938] focus:shadow-[0_0_0_2px_rgba(173,198,255,0.4)] transition-all"
                  />

                  <button
                    type="button"
                    aria-label="Tampilkan atau sembunyikan kata sandi"
                    onClick={() =>
                      setShowNewPassword((current) => !current)
                    }
                    className="absolute right-4 text-[#c7c6cb] hover:text-[#dfe1f5] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showNewPassword
                        ? "visibility_off"
                        : "visibility"}
                    </span>
                  </button>
                </div>

                {/* STRENGTH BAR */}
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                  {[0, 1, 2, 3].map((index) => {
                    const active = index < score;

                    let barClass = "bg-[#303443]";

                    if (active) {
                      if (score <= 1) {
                        barClass = "bg-[#ffb4ab]";
                      } else if (score === 2) {
                        barClass = "bg-amber-400";
                      } else {
                        barClass = "bg-[#adc6ff]";
                      }
                    }

                    return (
                      <div
                        key={index}
                        className={`h-1 rounded-full transition-colors duration-200 ${barClass}`}
                      />
                    );
                  })}
                </div>

                {/* REQUIREMENTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-1 p-3 bg-[#1b1f2d]/60 rounded-xl">
                  {requirements.map((requirement) => (
                    <div
                      key={requirement.label}
                      className={`flex items-center gap-2 text-[12px] transition-colors ${
                        requirement.valid
                          ? "text-[#adc6ff]"
                          : "text-[#c7c6cb]"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          requirement.valid
                            ? "text-[#adc6ff]"
                            : "text-[#919095]"
                        }`}
                      >
                        {requirement.valid
                          ? "check_circle"
                          : "radio_button_unchecked"}
                      </span>

                      <span>{requirement.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="confirm-password"
                    className="text-sm font-medium text-[#dfe1f5]"
                  >
                    Konfirmasi Kata Sandi Baru
                  </label>

                  {confirmPassword && (
                    <span
                      className={`text-[12px] flex items-center gap-1 ${
                        passwordsMatch
                          ? "text-[#adc6ff]"
                          : "text-[#ffb4ab]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {passwordsMatch ? "check" : "close"}
                      </span>

                      {passwordsMatch
                        ? "Kata sandi cocok"
                        : "Tidak cocok"}
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-[#c7c6cb] pointer-events-none text-[20px]">
                    key
                  </span>

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-[#1b1f2d] text-[#dfe1f5] placeholder:text-[#46464b] rounded-2xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:bg-[#252938] focus:shadow-[0_0_0_2px_rgba(173,198,255,0.4)] transition-all"
                  />

                  <button
                    type="button"
                    aria-label="Tampilkan atau sembunyikan konfirmasi kata sandi"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-4 text-[#c7c6cb] hover:text-[#dfe1f5] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword
                        ? "visibility_off"
                        : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* SECURITY NOTICE */}
              <div className="p-4 rounded-2xl bg-[#252938]/70 flex items-start gap-3 mt-1">
                <span className="material-symbols-outlined text-[#adc6ff] text-[22px] shrink-0 mt-0.5">
                  security_update_warning
                </span>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#dfe1f5] font-semibold">
                    Pemberitahuan Keamanan
                  </span>

                  <p className="text-[12px] leading-relaxed text-[#c7c6cb]">
                    Setelah kata sandi berhasil diubah, sesi akun
                    akan dikeluarkan dan Anda perlu masuk kembali
                    menggunakan kata sandi baru.
                  </p>
                </div>
              </div>

              {/* ERROR */}
              {errorMessage && (
                <div className="rounded-xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-4 py-3 text-sm text-[#ffb4ab]">
                  {errorMessage}
                </div>
              )}

              {/* ACTION */}
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="submit"
                  disabled={
                    saving ||
                    !allRequirementsMet ||
                    !passwordsMatch
                  }
                  className="w-full relative overflow-hidden group py-3.5 px-6 rounded-full bg-gradient-to-r from-[#0566d9] to-[#0f0030] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(5,102,217,0.35)] transition-all"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        sync
                      </span>
                      <span>Memperbarui Sandi...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Simpan Kata Sandi Baru & Masuk
                      </span>

                      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>

                <Link
                  href="/login"
                  className="w-full py-2.5 rounded-full flex items-center justify-center gap-2 text-[#c7c6cb] hover:text-[#dfe1f5] hover:bg-[#1b1f2d] transition-all text-sm font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>

                  <span>
                    Batal dan Kembali ke Halaman Masuk
                  </span>
                </Link>
              </div>
            </form>

            {/* SUPPORT */}
            <div className="pt-2 text-center">
              <p className="text-[12px] text-[#919095]">
                Butuh bantuan dengan akun Anda?{" "}
                <span className="text-[#adc6ff]">
                  Hubungi Pembimbing Lapangan
                </span>{" "}
                atau IT Support Sekolah.
              </p>
            </div>
          </div>

          {/* METADATA */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[#c7c6cb] text-[12px]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#adc6ff]" />

            <span>
              Protokol Keamanan Autentikasi v2.4 • PKL Journal
              Platform
            </span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#090e1b] py-4 shadow-[0_-1px_8px_rgba(0,0,0,0.2)]">
        <div className="w-full px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#c7c6cb] text-center md:text-left">
            © 2026 PKL Journal. All rights reserved. Platform
            Praktik Kerja Lapangan. By NgussDeveloper.
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#171b29] text-[#c7c6cb]">
              <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">
                lock
              </span>

              <span className="text-[12px]">
                256-bit SSL Encrypted
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#171b29] text-[#c7c6cb]">
              <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">
                verified_user
              </span>

              <span className="text-[12px]">
                SSO Protected
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}