import { redirect } from "next/navigation";

import VerificationEmailPage from "@/components/auth/VerificationEmailPage";

type VerificationEmailPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerificationEmailRoute({
  searchParams,
}: VerificationEmailPageProps) {
  const params = await searchParams;

  const email = params.email?.trim();

  if (!email) {
    redirect("/register");
  }

  return (
    <VerificationEmailPage email={email} />
  );
}