"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginLoading, loginError } = useAuth();
  const [sessionExpired] = useState(() => {
    if (typeof window === "undefined") return false;
    const reason = sessionStorage.getItem("hc_session_reason");
    if (reason === "expired") {
      sessionStorage.removeItem("hc_session_reason");
      return true;
    }
    return false;
  });

  return (
    <LoginForm
      onLogin={login}
      onSuccess={() => router.push(ROUTES.HABITS)}
      isLoading={loginLoading}
      error={loginError}
      sessionExpired={sessionExpired}
    />
  );
}
