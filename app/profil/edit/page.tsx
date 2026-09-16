import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EditProfilPageContent from "@/components/profil/EditProfilPageContent";

export default async function EditProfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "nama, email, id_praktikan, program_studi, tempat_pkl, avatar_path"
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/profil");
  }

  let avatarUrl = "";

  if (profile.avatar_path) {
    const { data: signedUrlData } = await supabase.storage
      .from("avatars")
      .createSignedUrl(
        profile.avatar_path,
        60 * 60
      );

    avatarUrl = signedUrlData?.signedUrl ?? "";
  }

  return (
    <main className="min-h-screen bg-[#0f1320] text-[#dfe1f5]">
      <DashboardHeader
        nama={profile.nama || user.email || "Pengguna"}
        avatarUrl={avatarUrl}
        active="profil"
      />

      <div className="pt-16">
        <EditProfilPageContent
          profile={profile}
          avatarUrl={avatarUrl}
        />
      </div>

      <footer className="bg-[#171b29] px-6 py-8 text-center text-xs text-[#c7c6cb]">
        © 2026 PKL Journal. All rights reserved.
        Platform Praktik Kerja Lapangan. By
        NgussDeveloper.
      </footer>
    </main>
  );
}