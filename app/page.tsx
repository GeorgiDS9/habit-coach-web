"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ROUTES } from "@/constants/routes";
import { Spinner } from "@/components/ui/Spinner";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(ROUTES.HABITS);
    } else {
      router.replace(ROUTES.LOGIN);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
