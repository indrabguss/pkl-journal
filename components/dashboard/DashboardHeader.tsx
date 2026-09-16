"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type DashboardHeaderProps = {
  nama: string;
  avatarUrl?: string;
  active?:
    | "dashboard"
    | "laporan"
    | "kalender"
    | "dokumentasi"
    | "profil";
};

export default function DashboardHeader({
  nama,
  avatarUrl = "",
  active,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (
    key: NonNullable<DashboardHeaderProps["active"]>
  ) => {
    if (key === "dashboard") {
      return pathname === "/dashboard";
    }

    if (key === "laporan") {
      return (
        pathname === "/laporan" ||
        pathname.startsWith("/laporan/")
      );
    }

    if (key === "kalender") {
      return (
        pathname === "/kalender" ||
        pathname.startsWith("/kalender/")
      );
    }

    if (key === "dokumentasi") {
      return (
        pathname === "/dokumentasi" ||
        pathname.startsWith("/dokumentasi/")
      );
    }

    if (key === "profil") {
      return (
        pathname === "/profil" ||
        pathname.startsWith("/profil/")
      );
    }

    return false;
  };

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  }

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      key: "dashboard" as const,
      icon: "dashboard",
    },
    {
      label: "Laporan",
      href: "/laporan",
      key: "laporan" as const,
      icon: "description",
    },
    {
      label: "Kalender",
      href: "/kalender",
      key: "kalender" as const,
      icon: "calendar_month",
    },
    {
      label: "Dokumentasi",
      href: "/dokumentasi",
      key: "dokumentasi" as const,
      icon: "photo_library",
    },
    {
      label: "Profil",
      href: "/profil",
      key: "profil" as const,
      icon: "person",
    },
  ];

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-[#0f1320]/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/dashboard"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0566d9]">
            <span className="material-symbols-outlined text-[18px] text-[#e6ecff]">
              auto_stories
            </span>
          </div>

          <span className="font-[Syne] text-lg font-semibold tracking-tight text-[#dfe1f5]">
            PKL Journal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {menuItems.map((item) => {
            const activeState =
              active === item.key ||
              isActive(item.key);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={[
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  activeState
                    ? "bg-[#0566d9] font-medium text-[#e6ecff]"
                    : "text-[#c7c6cb] hover:text-[#dfe1f5]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/laporan/buat"
            className="inline-flex items-center gap-2 rounded-full bg-[#0566d9] px-4 py-2.5 text-sm font-medium text-[#e6ecff] shadow-sm transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
          >
            <span className="material-symbols-outlined text-[18px]">
              add
            </span>
            Buat Laporan
          </Link>

          <Link
            href="/profil"
            className="flex items-center gap-2 border-l border-[#46464b] pl-3"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#303443]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`Foto profil ${nama}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[18px] text-[#c7c6cd]">
                  person
                </span>
              )}
            </div>

            <span className="max-w-32 truncate text-sm font-medium text-[#dfe1f5]">
              {nama}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#919095] transition hover:bg-[#252938] hover:text-[#dfe1f5]"
            aria-label="Keluar"
            title="Keluar"
          >
            <span className="material-symbols-outlined text-[19px]">
              logout
            </span>
          </button>
        </div>

        {/* Mobile Right */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Small Avatar */}
          <Link
            href="/profil"
            onClick={closeMobileMenu}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#303443]"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`Foto profil ${nama}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-[18px] text-[#c7c6cd]">
                person
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen((value) => !value)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#dfe1f5] transition hover:bg-[#252938]"
            aria-label={
              mobileOpen
                ? "Tutup menu"
                : "Buka menu"
            }
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-[#46464b]/40 bg-[#0f1320]/95 px-4 pb-5 pt-3 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const activeState =
                active === item.key ||
                isActive(item.key);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={[
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                    activeState
                      ? "bg-[#0566d9] font-medium text-[#e6ecff]"
                      : "text-[#c7c6cb] hover:bg-[#252938] hover:text-[#dfe1f5]",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>

                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/laporan/buat"
              onClick={closeMobileMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#0566d9] px-4 py-3 text-sm font-medium text-[#e6ecff] transition hover:bg-[#adc6ff] hover:text-[#002e6a]"
            >
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>
              Buat Laporan
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm text-[#ffb4ab] transition hover:bg-[#93000a]/20"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Keluar
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}