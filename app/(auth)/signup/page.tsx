"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export default function SignupPage() {
  const router = useRouter();
  const { signup, signupLoading, signupError } = useAuth();

  return (
    <SignupForm
      onSignup={signup}
      onSuccess={() => router.push(ROUTES.HABITS)}
      isLoading={signupLoading}
      error={signupError}
    />
  );
}
