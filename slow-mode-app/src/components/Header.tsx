"use client";

import { useEffect, useState } from 'react';
import { ArrowBackIcon } from './Icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export default function Header({ title, onBack }: HeaderProps) {
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
    // Header mobile avec bande colorée et flèche de retour optionnelle
    return (
      <div className="w-full h-22 flex items-center justify-center bg-header-bg relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 hover:bg-zinc-200 rounded-full transition-colors z-10 cursor-pointer"
            type="button"
          >
            <ArrowBackIcon className="w-6 h-6" />
          </button>
        )}
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