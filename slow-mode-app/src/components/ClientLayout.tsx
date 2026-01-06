"use client";

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/AuthProvider';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="mx-auto min-h-screen w-full max-w-2xl bg-white shadow-2xl relative transform-gpu">
        {children}
      </div>
    </AuthProvider>
  );
}
