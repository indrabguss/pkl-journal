import type { SupabaseClient } from "@supabase/supabase-js";

export async function getProfileWithAvatar(
  supabase: SupabaseClient,
  userId: string
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "nama, email, id_praktikan, program_studi, tempat_pkl, avatar_path, created_at"
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error(
      "Gagal mengambil profile:",
      error.message
    );

    return {
      profile: null,
      avatarUrl: "",
    };
  }

  let avatarUrl = "";

  if (profile?.avatar_path) {
    const { data, error: avatarError } =
      await supabase.storage
        .from("avatars")
        .createSignedUrl(
          profile.avatar_path,
          60 * 60
        );

    if (avatarError) {
      console.error(
        "Gagal membuat signed URL avatar:",
        avatarError.message
      );
    } else {
      avatarUrl = data?.signedUrl ?? "";
    }
  }

  return {
    profile,
    avatarUrl,
  };
}