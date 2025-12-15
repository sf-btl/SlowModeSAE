"use client";

import { usePathname } from 'next/navigation';
import BottomNav from './CreatorBottomNav';

export default function BottomNavClientWrapper() {

    // Le hook usePathname ne fonctionne que dans un Client Component
    const pathname = usePathname();

    // On passe le chemin récupéré à la barre de navigation
    return <BottomNav activePath={pathname} />;
}