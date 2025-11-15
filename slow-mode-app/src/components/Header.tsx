"use client";

import { useEffect, useState } from 'react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    // Header mobile avec bande colorée
    return (
      <div className="w-full h-22 flex items-center justify-center bg-header-bg">
        <div className="max-w-64 mx-auto">
          <h1 className="text-black text-3xl font-normal font-lusitana text-center leading-tight wrap-break-word">
            {title}
          </h1>
        </div>
      </div>
    );
  }

  // Desktop - titre normal sans header
  return (
    <div className="pt-8 pb-4">
      <h1 className="text-4xl font-normal text-zinc-900 font-lusitana text-center">
        {title}
      </h1>
    </div>
  );
}