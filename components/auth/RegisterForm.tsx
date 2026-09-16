"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="9" r="2.5" />
      <path d="M8 16c1.2-2 6.8-2 8 0" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m3 9 9-5 9 5-9 5-9-5Z" />
      <path d="M7 11.5V16c2.8 2 7.2 2 10 0v-4.5" />
      <path d="M21 9v6" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M16 9h2a2 2 0 0 1 2 2v10" />
      <path d="M8 7h4M8 11h4M8 15h4M8 19h4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
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

function InputWrapper({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#919095]">
        {icon}
      </span>

      {children}
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    idPraktikan: "",
    programStudi: "",
    tempatPkl: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const nama = form.nama.trim();
    const email = form.email.trim();
    const idPraktikan = form.idPraktikan.trim();
    const programStudi = form.programStudi.trim();
    const tempatPkl = form.tempatPkl.trim();

    if (!nama) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!email) {
      setError("Email wajib diisi.");
      return;
    }

    if (!idPraktikan) {
      setError("NIS / NPM / ID Praktikan wajib diisi.");
      return;
    }

    if (!programStudi) {
      setError("Program studi / jurusan wajib diisi.");
      return;
    }

    if (!tempatPkl) {
      setError("Tempat PKL wajib diisi.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Gunakan URL aplikasi yang sudah ditentukan di .env.local.
       * Ini mencegah URL callback ikut membawa :3000 ketika
       * aplikasi diakses melalui Dev Tunnel.
       */
      const configuredSiteUrl =
        process.env.NEXT_PUBLIC_SITE_URL?.trim();

      if (!configuredSiteUrl) {
        setError(
          "NEXT_PUBLIC_SITE_URL belum dikonfigurasi. Periksa file .env.local."
        );
        return;
      }

      const siteUrl = configuredSiteUrl.replace(/\/+$/, "");

      const redirectUrl =
        `${siteUrl}/auth/callback?next=/verifikasi`;

      console.log("Register redirect URL:", redirectUrl);

      const { error: signUpError } =
        await supabase.auth.signUp({
          email,
          password: form.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              nama,
              id_praktikan: idPraktikan,
              program_studi: programStudi,
              tempat_pkl: tempatPkl,
            },
          },
        });

      if (signUpError) {
        console.error(
          "Gagal registrasi:",
          signUpError.message
        );

        setError(signUpError.message);
        return;
      }

      router.push(
        `/verifikasi-email?email=${encodeURIComponent(email)}`
      );
    } catch (submitError) {
      console.error(
        "Error registrasi:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Registrasi gagal diproses."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Nama Lengkap */}
        <div className="space-y-1 md:col-span-2">
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-[#dfe1f5]"
          >
            Nama Lengkap
          </label>

          <InputWrapper icon={<PersonIcon />}>
            <input
              id="nama"
              name="nama"
              type="text"
              autoComplete="name"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukan Nama Lengkap"
              required
              disabled={isSubmitting}
              className="w-full rounded-full border-0 bg-[#1b1f2d] py-3 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#797980] focus:ring-2 focus:ring-[#adc6ff] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </InputWrapper>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#dfe1f5]"
          >
            Email
          </label>

          <InputWrapper icon={<MailIcon />}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukan Email"
              required
              disabled={isSubmitting}
              className="w-full rounded-full border-0 bg-[#1b1f2d] py-3 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#797980] focus:ring-2 focus:ring-[#adc6ff] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </InputWrapper>
        </div>

        {/* NIS / NPM / ID Praktikan */}
        <div className="space-y-1">
          <label
            htmlFor="idPraktikan"
            className="block text-sm font-medium text-[#dfe1f5]"
          >
            NIS / NPM / ID Praktikan
          </label>

          <InputWrapper icon={<BadgeIcon />}>
            <input
              id="idPraktikan"
              name="idPraktikan"
              type="text"
              value={form.idPraktikan}
              onChange={handleChange}
              placeholder="202143500123"
              required
              disabled={isSubmitting}
              className="w-full rounded-full border-0 bg-[#1b1f2d] py-3 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#797980] focus:ring-2 focus:ring-[#adc6ff] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </InputWrapper>
        </div>

        {/* Program Studi */}
        <div className="space-y-1">
          <label
            htmlFor="programStudi"
            className="block text-sm font-medium text-[#dfe1f5]"
          >
            Program Studi / Jurusan
          </label>

          <InputWrapper icon={<SchoolIcon />}>
            <input
              id="programStudi"
              name="programStudi"
              type="text"
              value={form.programStudi}
              onChange={handleChange}
              placeholder="Masukan Prodi & Jurusan"
              required
              disabled={isSubmitting}
              className="w-full rounded-full border-0 bg-[#1b1f2d] py-3 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#797980] focus:ring-2 focus:ring-[#adc6ff] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </InputWrapper>
        </div>

        {/* Tempat PKL */}
        <div className="space-y-1">
          <label
            htmlFor="tempatPkl"
            className="block text-sm font-medium text-[#dfe1f5]"
          >
            Tempat PKL (Instansi/Kantor)
          </label>

          <InputWrapper icon={<BuildingIcon />}>
            <input
              id="tempatPkl"
              name="tempatPkl"
              type="text"
              value={form.tempatPkl}
              onChange={handleChange}
              placeholder="Masukan Tempat PKL"
              required
              disabled={isSubmitting}
              className="w-full rounded-full border-0 bg-[#1b1f2d] py-3 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#797980] focus:ring-2 focus:ring-[#adc6ff] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </InputWrapper>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#dfe1f5]"
          >
            Password
          </label>

          <InputWrapper icon={<LockIcon />}>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className="w-full rounded-full border-0 bg-[#1b1f2d] py-3 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#797980] focus:ring-2 focus:ring-[#adc6ff] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </InputWrapper>
        </div>

        {/* Konfirmasi Password */}
        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-[#dfe1f5]"
          >
            Konfirmasi Password
          </label>

          <InputWrapper icon={<LockIcon />}>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className="w-full rounded-full border-0 bg-[#1b1f2d] py-3 pl-12 pr-4 text-sm text-[#dfe1f5] outline-none transition placeholder:text-[#797980] focus:ring-2 focus:ring-[#adc6ff] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </InputWrapper>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#ffb4ab]/30 bg-[#93000a]/20 px-4 py-3 text-sm leading-5 text-[#ffb4ab]"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0566d9] px-4 py-3 text-sm font-medium text-[#e6ecff] shadow-lg transition-all hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>
            {isSubmitting
              ? "Membuat Akun..."
              : "Daftar Sekarang"}
          </span>

          {!isSubmitting && <ArrowIcon />}
        </button>
      </div>
    </form>
  );
}