"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/AuthProvider";
import AppHeader from "@/components/AppHeader";

const AUTH_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/test-auth"];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isAuthRoute) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f1e8,_#ffffff_65%)] text-zinc-900">
        <AppHeader />
        <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
      </div>
    </AuthProvider>
  );
}
