import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getProfileWithAvatar } from "@/lib/supabase/profile";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UbahPasswordPageContent from "@/components/profil/UbahPasswordPageContent";

export default async function UbahPasswordPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { profile, avatarUrl } =
    await getProfileWithAvatar(
      supabase,
      user.id
    );

  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <DashboardHeader
        nama={
          profile?.nama ??
          user.email ??
          "Pengguna"
        }
        avatarUrl={avatarUrl}
        active="profil"
      />

      <div className="pt-16">
        <UbahPasswordPageContent
          email={user.email ?? ""}
        />
      </div>

      <footer className="bg-[#171b29] px-6 py-8 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved.
        Platform Praktik Kerja Lapangan. By NgussDeveloper
      </footer>
    </main>
  );
}