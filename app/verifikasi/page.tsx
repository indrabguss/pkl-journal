import { redirect } from "next/navigation";
import VerificationSuccessPage from "@/components/auth/VerificationSuccessPage";
import { createClient } from "@/lib/supabase/server";

export default async function VerificationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/verifikasi-gagal");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("nama, email, tempat_pkl")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/verifikasi-gagal");
  }

  return (
    <VerificationSuccessPage
      nama={profile.nama}
      email={profile.email}
      tempatPkl={profile.tempat_pkl}
    />
  );
}