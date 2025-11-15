"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-zinc-900 font-lusitana mb-8">
          SlowMode
        </h1>
        <Link 
          href="/login"
          className="bg-zinc-900 text-white px-6 py-3 rounded-md hover:bg-zinc-800 transition-colors"
        >
          Aller au Login
        </Link>
      </div>
    </div>
  );
}
