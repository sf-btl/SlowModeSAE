"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Alert from "@/components/Alert";
import {
  EmailIcon,
  PasswordIcon,
  ProfilIcon,
  PhoneIcon,
  CompanyIcon,
  SiretIcon,
} from "@/components/Icons";
import { MapPin } from "lucide-react";

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_#f7f1e8,_#ffffff_65%)] text-zinc-900">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-zinc-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-lusitana text-xl tracking-[0.3em] text-cyan-950">
            SLOWMODE
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-istok-web uppercase tracking-wide text-zinc-700 lg:flex">
            <Link href="/#projet" className="hover:text-cyan-950 transition-colors">
              Projet
            </Link>
            <Link href="/#methode" className="hover:text-cyan-950 transition-colors">
              Methode
            </Link>
            <Link href="/#impact" className="hover:text-cyan-950 transition-colors">
              Impact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-950 sm:inline">
              S&apos;inscrire
            </span>
            <Link
              href="/login"
              className="rounded-full bg-cyan-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-900"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-amber-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="order-2 flex flex-col justify-center gap-6 lg:order-1">
            <p className="text-sm font-montserrat uppercase tracking-[0.35em] text-zinc-600">
              Rejoindre la couture locale
            </p>
            <h1 className="text-4xl font-lusitana text-cyan-950 sm:text-5xl">
              Une inscription simple pour creer des pieces plus responsables.
            </h1>
            <p className="text-base font-istok-web leading-relaxed text-zinc-700">
              Choisissez votre role, indiquez votre localite et commencez a discuter avec les
              artisans et fournisseurs de votre region.
            </p>
            <div className="rounded-3xl border border-white/60 bg-white/80 p-3 shadow-lg">
              <Image
                src="/uploads/1767778118410-jsaeo4p.avif"
                alt="Atelier et tissu responsable"
                width={620}
                height={420}
                className="h-56 w-full rounded-[24px] object-cover sm:h-64"
                priority
              />
            </div>
          </div>

          <div className="order-1 flex items-center lg:order-2">
            <div className="w-full rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
              <div className="mb-8">
                <p className="text-xs font-montserrat uppercase tracking-[0.35em] text-zinc-500">
                  {subtitle}
                </p>
                <h2 className="mt-3 text-3xl font-lusitana text-cyan-950">{title}</h2>
              </div>
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Register() {
  const [showFullForm, setShowFullForm] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [countryCode, setCountryCode] = useState("+33");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [adressePostale, setAdressePostale] = useState("");
  const [ville, setVille] = useState("");
  const [acceptedCGU, setAcceptedCGU] = useState(false);

  const departments = [
    { code: "01", name: "Ain" },
    { code: "02", name: "Aisne" },
    { code: "03", name: "Allier" },
    { code: "04", name: "Alpes-de-Haute-Provence" },
    { code: "05", name: "Hautes-Alpes" },
    { code: "06", name: "Alpes-Maritimes" },
    { code: "07", name: "Ardeche" },
    { code: "08", name: "Ardennes" },
    { code: "09", name: "Ariege" },
    { code: "10", name: "Aube" },
    { code: "11", name: "Aude" },
    { code: "12", name: "Aveyron" },
    { code: "13", name: "Bouches-du-Rhone" },
    { code: "14", name: "Calvados" },
    { code: "15", name: "Cantal" },
    { code: "16", name: "Charente" },
    { code: "17", name: "Charente-Maritime" },
    { code: "18", name: "Cher" },
    { code: "19", name: "Correze" },
    { code: "21", name: "Cote-d'Or" },
    { code: "22", name: "Cotes-d'Armor" },
    { code: "23", name: "Creuse" },
    { code: "24", name: "Dordogne" },
    { code: "25", name: "Doubs" },
    { code: "26", name: "Drome" },
    { code: "27", name: "Eure" },
    { code: "28", name: "Eure-et-Loir" },
    { code: "29", name: "Finistere" },
    { code: "30", name: "Gard" },
    { code: "31", name: "Haute-Garonne" },
    { code: "32", name: "Gers" },
    { code: "33", name: "Gironde" },
    { code: "34", name: "Herault" },
    { code: "35", name: "Ille-et-Vilaine" },
    { code: "36", name: "Indre" },
    { code: "37", name: "Indre-et-Loire" },
    { code: "38", name: "Isere" },
    { code: "39", name: "Jura" },
    { code: "40", name: "Landes" },
    { code: "41", name: "Loir-et-Cher" },
    { code: "42", name: "Loire" },
    { code: "43", name: "Haute-Loire" },
    { code: "44", name: "Loire-Atlantique" },
    { code: "45", name: "Loiret" },
    { code: "46", name: "Lot" },
    { code: "47", name: "Lot-et-Garonne" },
    { code: "48", name: "Lozere" },
    { code: "49", name: "Maine-et-Loire" },
    { code: "50", name: "Manche" },
    { code: "51", name: "Marne" },
    { code: "52", name: "Haute-Marne" },
    { code: "53", name: "Mayenne" },
    { code: "54", name: "Meurthe-et-Moselle" },
    { code: "55", name: "Meuse" },
    { code: "56", name: "Morbihan" },
    { code: "57", name: "Moselle" },
    { code: "58", name: "Nievre" },
    { code: "59", name: "Nord" },
    { code: "60", name: "Oise" },
    { code: "61", name: "Orne" },
    { code: "62", name: "Pas-de-Calais" },
    { code: "63", name: "Puy-de-Dome" },
    { code: "64", name: "Pyrenees-Atlantiques" },
    { code: "65", name: "Hautes-Pyrenees" },
    { code: "66", name: "Pyrenees-Orientales" },
    { code: "67", name: "Bas-Rhin" },
    { code: "68", name: "Haut-Rhin" },
    { code: "69", name: "Rhone" },
    { code: "70", name: "Haute-Saone" },
    { code: "71", name: "Saone-et-Loire" },
    { code: "72", name: "Sarthe" },
    { code: "73", name: "Savoie" },
    { code: "74", name: "Haute-Savoie" },
    { code: "75", name: "Paris" },
    { code: "76", name: "Seine-Maritime" },
    { code: "77", name: "Seine-et-Marne" },
    { code: "78", name: "Yvelines" },
    { code: "79", name: "Deux-Sevres" },
    { code: "80", name: "Somme" },
    { code: "81", name: "Tarn" },
    { code: "82", name: "Tarn-et-Garonne" },
    { code: "83", name: "Var" },
    { code: "84", name: "Vaucluse" },
    { code: "85", name: "Vendee" },
    { code: "86", name: "Vienne" },
    { code: "87", name: "Haute-Vienne" },
    { code: "88", name: "Vosges" },
    { code: "89", name: "Yonne" },
    { code: "90", name: "Territoire de Belfort" },
    { code: "91", name: "Essonne" },
    { code: "92", name: "Hauts-de-Seine" },
    { code: "93", name: "Seine-Saint-Denis" },
    { code: "94", name: "Val-de-Marne" },
    { code: "95", name: "Val-d'Oise" },
  ];

  const countryCodes = [
    { code: "+33", country: "France" },
    { code: "+32", country: "Belgique" },
    { code: "+41", country: "Suisse" },
    { code: "+1", country: "Etats-Unis" },
    { code: "+44", country: "Royaume-Uni" },
    { code: "+49", country: "Allemagne" },
    { code: "+39", country: "Italie" },
    { code: "+34", country: "Espagne" },
  ];

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(departmentInput.toLowerCase()) ||
      dept.code.includes(departmentInput)
  );

  const accountTypes = [
    { label: "Acheteur responsable", value: "particulier" },
    { label: "Createur de qualite", value: "professionnel" },
    { label: "Fournisseur engage", value: "entreprise" },
  ];

  const handleContinue = () => {
    if (accountType && department) {
      setShowFullForm(true);
    }
  };

  const handleDepartmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepartmentInput(value);
    setShowSuggestions(value.length > 0);

    const exactMatch = departments.find(
      (dept) =>
        dept.name.toLowerCase() === value.toLowerCase() ||
        dept.code === value ||
        `${dept.code} - ${dept.name}` === value
    );

    if (exactMatch) {
      setDepartment(exactMatch.code);
    } else {
      setDepartment("");
    }
  };

  const selectDepartment = (dept: { code: string; name: string }) => {
    const displayValue = `${dept.code} - ${dept.name}`;
    setDepartmentInput(displayValue);
    setDepartment(dept.code);
    setShowSuggestions(false);
  };

  const validatePasswords = () => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && value !== password) {
      setPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedCGU) {
      setAlert({ type: "error", message: "Vous devez accepter les conditions d'utilisation (CGU)" });
      return;
    }

    if (!validatePasswords()) return;

    setAlert(null);
    const formData = new FormData(e.target as HTMLFormElement);

    const data = {
      accountType,
      adresse_postale: formData.get("adresse_postale") as string,
      ville: formData.get("ville") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      companyName: formData.get("companyName") as string,
      siret: formData.get("siret") as string,
      email: formData.get("email") as string,
      password,
      phoneNumber,
      countryCode,
      acceptedCGU,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setAlert({ type: "success", message: "Compte cree avec succes ! Redirection..." });
        setTimeout(() => {
          window.location.href = "/profil";
        }, 1500);
      } else {
        setAlert({ type: "error", message: result.message || "Erreur lors de la creation du compte" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setAlert({ type: "error", message: "Erreur lors de la creation du compte" });
    }
  };

  const getFormTitle = () => {
    switch (accountType) {
      case "particulier":
        return "Creez votre compte Acheteur";
      case "professionnel":
        return "Creez votre compte Createur";
      case "entreprise":
        return "Creez votre compte Fournisseur";
      default:
        return "Creez votre compte";
    }
  };

  if (showFullForm) {
    return (
      <AuthShell title={getFormTitle()} subtitle="Inscription">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="accountType" value={accountType} />
          <input type="hidden" name="department" value={department} />

          <button
            type="button"
            onClick={() => setShowFullForm(false)}
            className="text-xs font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors"
          >
            Retour a la selection
          </button>

          {accountType === "entreprise" ? (
            <>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                required
                placeholder="Societe"
                icon={<CompanyIcon className="w-5 h-5" />}
              />
              <Input
                id="siret"
                name="siret"
                type="text"
                required
                placeholder="Numero Siret"
                icon={<SiretIcon className="w-5 h-5" />}
              />
            </>
          ) : (
            <>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="Prenom"
                icon={<ProfilIcon className="w-5 h-5" />}
              />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Nom"
                icon={<ProfilIcon className="w-5 h-5" />}
              />
            </>
          )}

          <Input
            id="adresse_postale"
            name="adresse_postale"
            type="text"
            required
            value={adressePostale}
            onChange={(e) => setAdressePostale(e.target.value)}
            placeholder="Adresse postale (rue, numero, etc.)"
            icon={<MapPin className="w-5 h-5 text-gray-900" />}
          />

          <Input
            id="ville"
            name="ville"
            type="text"
            required
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ville"
            icon={<MapPin className="w-5 h-5 text-gray-900" />}
          />

          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="E-mail"
            icon={<EmailIcon className="w-5 h-5" />}
          />

          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            error={!!passwordError}
            placeholder="Mot de passe"
            icon={<PasswordIcon className="w-5 h-5" />}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            error={!!passwordError}
            placeholder="Confirmer le mot de passe"
            icon={<PasswordIcon className="w-5 h-5" />}
          />


          <div className="flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="rounded-l-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-montserrat text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code}
                </option>
              ))}
            </select>
            <div className="relative flex-1">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-r-md border border-l-0 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-montserrat text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
                placeholder="Numero de telephone"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <PhoneIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

          <Button type="submit">Confirmer</Button>

          <div className="mt-4 flex items-start gap-3">
            <input
              id="acceptedCGU"
              name="acceptedCGU"
              type="checkbox"
              checked={acceptedCGU}
              onChange={(e) => setAcceptedCGU(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-cyan-950 focus:ring-cyan-900"
            />
            <label htmlFor="acceptedCGU" className="text-sm font-montserrat text-zinc-700">
              J'ai lu et j'accepte les <a href="/cgu" target="_blank" className="underline text-cyan-900">Conditions Générales d'Utilisation</a>
            </label>
          </div>

          <div className="text-center text-sm font-montserrat text-zinc-700">
            Deja un compte ?{" "}
            <Link
              href="/login"
              className="font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Commencons en douceur" subtitle="Inscription">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2 font-montserrat">
            Type de compte
          </label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-montserrat text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
          >
            <option value="" disabled hidden>
              Selectionnez votre profil
            </option>
            {accountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-zinc-700 mb-2 font-montserrat">
            Choisissez votre localite
          </label>
          <p className="text-xs text-zinc-500 mb-4 font-montserrat max-w-60">
            Departement ou sera faconne et livre votre vetement.
          </p>
          <Input
            type="text"
            id="department"
            value={departmentInput}
            onChange={handleDepartmentInputChange}
            onFocus={() => setShowSuggestions(departmentInput.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Tapez votre departement"
          />

          {showSuggestions && filteredDepartments.length > 0 && (
            <div className="absolute z-10 w-full rounded-md border border-zinc-200 bg-white shadow-lg max-h-40 overflow-y-auto mt-1">
              {filteredDepartments.slice(0, 5).map((dept) => (
                <div
                  key={dept.code}
                  onClick={() => selectDepartment(dept)}
                  className="px-3 py-2 hover:bg-zinc-100 cursor-pointer font-montserrat text-sm text-zinc-900"
                >
                  {dept.code} - {dept.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button onClick={handleContinue} disabled={!accountType || !department}>
          Continuer
        </Button>

        <div className="text-center text-sm font-montserrat text-zinc-700">
          Deja un compte ?{" "}
          <Link
            href="/login"
            className="font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
