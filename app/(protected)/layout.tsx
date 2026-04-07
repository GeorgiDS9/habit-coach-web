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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="mr-6 text-lg font-extrabold tracking-tight text-indigo-700">Habit Coach</span>
            <nav className="flex items-center gap-1" aria-label="Main Navigation">
              <NavLink href={ROUTES.HABITS}>Habits</NavLink>
              <NavLink href={ROUTES.DASHBOARD}>Dashboard</NavLink>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out of your account"
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl px-4 py-10 flex-grow">{children}</main>
      <footer className="py-10 text-center text-xs text-gray-400 border-t border-gray-100 bg-white/50">
        &copy; {new Date().getFullYear()} Habit Coach. Build consistency, one day at a time.
      </footer>
    </div>
  );
}
