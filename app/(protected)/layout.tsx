"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, clearToken } from "@/lib/auth";
import { useApolloClient } from "@apollo/client/react";
import { ROUTES } from "@/constants/routes";
import { Spinner } from "@/components/ui/Spinner";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(ROUTES.LOGIN);
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleLogout = async () => {
    clearToken();
    await apolloClient.clearStore();
    router.replace(ROUTES.LOGIN);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="mr-4 text-base font-bold text-indigo-700">Habit Coach</span>
            <NavLink href={ROUTES.HABITS}>Habits</NavLink>
            <NavLink href={ROUTES.DASHBOARD}>Dashboard</NavLink>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Log out
          </button>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
