"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginLoading, loginError } = useAuth();

  return (
    <LoginForm
      onLogin={login}
      onSuccess={() => router.push(ROUTES.HABITS)}
      isLoading={loginLoading}
      error={loginError}
    />
  );
}
