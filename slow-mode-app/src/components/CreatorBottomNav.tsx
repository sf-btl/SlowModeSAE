// components/BottomNav.tsx

import Link from 'next/link';
// Assurez-vous d'avoir installé lucide-react (npm install lucide-react)
import { Home, Search, ShoppingCart, User, LucideIcon } from 'lucide-react';

// 1. Définir le type des objets de navigation
interface NavItem {
    href: string;
    label: string;
    Icon: LucideIcon;
}

// 2. Définir le type des props du composant
interface BottomNavProps {
    activePath: string;
}

const NavLinks: NavItem[] = [
    { href: '/', label: 'Accueil', Icon: Home },
    { href: '/tissus', label: 'Tissus', Icon: Search },
    { href: '/panier', label: 'Panier', Icon: ShoppingCart },
    { href: '/profil', label: 'Profil', Icon: User },
];

export default function BottomNav({ activePath }: BottomNavProps) {

    // Définition des classes de base communes à tous les boutons
    const baseClasses = "flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors duration-200 flex-grow";

    // 1. Inactif : Texte Gris Clair, Survol Jaune/Blanc
    const inactiveColorClasses = "text-gray-300 hover:text-yellow-100";

    // 2. Actif : Texte Blanc Crème/Jaune Clair, Rendu Grasset
    const activeColorClasses = "text-yellow-100 font-semibold";

    return (
        // Conteneur principal: Fixé en bas, pleine largeur, z-index élevé
        <footer className="fixed bottom-0 left-0 w-full bg-creatorcolor border-t border-gray-200 shadow-lg z-50">
            {/* Conteneur des liens: Centré, layout Flexbox */}
            <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
                {NavLinks.map((item) => {
                    const isActive = activePath === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            // COMBINAISON DE CLASSES :
                            // 1. Les classes de base (layout) sont toujours là.
                            // 2. Les classes de couleur active écrasent l'inactif si la condition est vraie.
                            className={`${baseClasses} ${isActive ? activeColorClasses : inactiveColorClasses}`}
                        >
                            {/* L'icône */}
                            <item.Icon size={24} className="mb-0.5" />

                            {/* Le label */}
                            <span className="sr-only sm:not-sr-only">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </footer>
    );
}