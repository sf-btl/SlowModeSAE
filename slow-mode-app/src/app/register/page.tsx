"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { EmailIcon, PasswordIcon, ProfilIcon, PhoneIcon, CompanyIcon, SiretIcon, ArrowBackIcon } from '@/components/Icons';

export default function Register() {
  const [showFullForm, setShowFullForm] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [department, setDepartment] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [countryCode, setCountryCode] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Liste des départements français (exemples) mettre db plus tard
  const departments = [
    { code: '01', name: 'Ain' },
    { code: '02', name: 'Aisne' },
    { code: '03', name: 'Allier' },
    { code: '04', name: 'Alpes-de-Haute-Provence' },
    { code: '05', name: 'Hautes-Alpes' },
    { code: '06', name: 'Alpes-Maritimes' },
    { code: '07', name: 'Ardèche' },
    { code: '08', name: 'Ardennes' },
    { code: '09', name: 'Ariège' },
    { code: '10', name: 'Aube' },
    { code: '11', name: 'Aude' },
    { code: '12', name: 'Aveyron' },
    { code: '13', name: 'Bouches-du-Rhône' },
    { code: '14', name: 'Calvados' },
    { code: '15', name: 'Cantal' },
    { code: '16', name: 'Charente' },
    { code: '17', name: 'Charente-Maritime' },
    { code: '18', name: 'Cher' },
    { code: '19', name: 'Corrèze' },
    { code: '21', name: 'Côte-d\'Or' },
    { code: '22', name: 'Côtes-d\'Armor' },
    { code: '23', name: 'Creuse' },
    { code: '24', name: 'Dordogne' },
    { code: '25', name: 'Doubs' },
    { code: '26', name: 'Drôme' },
    { code: '27', name: 'Eure' },
    { code: '28', name: 'Eure-et-Loir' },
    { code: '29', name: 'Finistère' },
    { code: '30', name: 'Gard' },
    { code: '31', name: 'Haute-Garonne' },
    { code: '32', name: 'Gers' },
    { code: '33', name: 'Gironde' },
    { code: '34', name: 'Hérault' },
    { code: '35', name: 'Ille-et-Vilaine' },
    { code: '36', name: 'Indre' },
    { code: '37', name: 'Indre-et-Loire' },
    { code: '38', name: 'Isère' },
    { code: '39', name: 'Jura' },
    { code: '40', name: 'Landes' },
    { code: '41', name: 'Loir-et-Cher' },
    { code: '42', name: 'Loire' },
    { code: '43', name: 'Haute-Loire' },
    { code: '44', name: 'Loire-Atlantique' },
    { code: '45', name: 'Loiret' },
    { code: '46', name: 'Lot' },
    { code: '47', name: 'Lot-et-Garonne' },
    { code: '48', name: 'Lozère' },
    { code: '49', name: 'Maine-et-Loire' },
    { code: '50', name: 'Manche' },
    { code: '51', name: 'Marne' },
    { code: '52', name: 'Haute-Marne' },
    { code: '53', name: 'Mayenne' },
    { code: '54', name: 'Meurthe-et-Moselle' },
    { code: '55', name: 'Meuse' },
    { code: '56', name: 'Morbihan' },
    { code: '57', name: 'Moselle' },
    { code: '58', name: 'Nièvre' },
    { code: '59', name: 'Nord' },
    { code: '60', name: 'Oise' },
    { code: '61', name: 'Orne' },
    { code: '62', name: 'Pas-de-Calais' },
    { code: '63', name: 'Puy-de-Dôme' },
    { code: '64', name: 'Pyrénées-Atlantiques' },
    { code: '65', name: 'Hautes-Pyrénées' },
    { code: '66', name: 'Pyrénées-Orientales' },
    { code: '67', name: 'Bas-Rhin' },
    { code: '68', name: 'Haut-Rhin' },
    { code: '69', name: 'Rhône' },
    { code: '70', name: 'Haute-Saône' },
    { code: '71', name: 'Saône-et-Loire' },
    { code: '72', name: 'Sarthe' },
    { code: '73', name: 'Savoie' },
    { code: '74', name: 'Haute-Savoie' },
    { code: '75', name: 'Paris' },
    { code: '76', name: 'Seine-Maritime' },
    { code: '77', name: 'Seine-et-Marne' },
    { code: '78', name: 'Yvelines' },
    { code: '79', name: 'Deux-Sèvres' },
    { code: '80', name: 'Somme' },
    { code: '81', name: 'Tarn' },
    { code: '82', name: 'Tarn-et-Garonne' },
    { code: '83', name: 'Var' },
    { code: '84', name: 'Vaucluse' },
    { code: '85', name: 'Vendée' },
    { code: '86', name: 'Vienne' },
    { code: '87', name: 'Haute-Vienne' },
    { code: '88', name: 'Vosges' },
    { code: '89', name: 'Yonne' },
    { code: '90', name: 'Territoire de Belfort' },
    { code: '91', name: 'Essonne' },
    { code: '92', name: 'Hauts-de-Seine' },
    { code: '93', name: 'Seine-Saint-Denis' },
    { code: '94', name: 'Val-de-Marne' },
    { code: '95', name: 'Val-d\'Oise' }
  ];

  // Liste des codes pays ici aussi db plus tard
  const countryCodes = [
    { code: '+33', country: 'France' },
    { code: '+32', country: 'Belgique' },
    { code: '+41', country: 'Suisse' },
    { code: '+1', country: 'États-Unis' },
    { code: '+44', country: 'Royaume-Uni' },
    { code: '+49', country: 'Allemagne' },
    { code: '+39', country: 'Italie' },
    { code: '+34', country: 'Espagne' }
  ];

  // Filtrer les départements selon la saisie
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(departmentInput.toLowerCase()) ||
    dept.code.includes(departmentInput)
  );

  const accountTypes = [
    { label: 'Acheteur responsable', value: 'particulier' },
    { label: 'Créateur de qualité', value: 'professionnel' },
    { label: 'Fournisseur engagé', value: 'entreprise' }
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
    
    // Vérifier si la saisie correspond exactement à un département
    const exactMatch = departments.find(dept => 
      dept.name.toLowerCase() === value.toLowerCase() || 
      dept.code === value ||
      `${dept.code} - ${dept.name}` === value
    );
    
    if (exactMatch) {
      setDepartment(exactMatch.code);
    } else {
      setDepartment('');
    }
  };

  const selectDepartment = (dept: { code: string; name: string }) => {
    const displayValue = `${dept.code} - ${dept.name}`;
    setDepartmentInput(displayValue);
    setDepartment(dept.code);
    setShowSuggestions(false);
  };

  // Validation des mots de passe
  const validatePasswords = () => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && value !== password) {
      setPasswordError('Les mots de passe ne correspondent pas');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePasswords()) {
      // Traitement du formulaire si les mots de passe correspondent
      console.log('Formulaire valide, traitement...');
    }
  };

  // Fonction pour obtenir le titre dynamique
  const getHeaderTitle = () => {
    if (!showFullForm) return "Inscription";
    
    switch(accountType) {
      case 'particulier':
        return "Inscription Acheteur";
      case 'professionnel':
        return "Inscription Créateur";
      case 'entreprise':
        return "Inscription Fournisseur";
      default:
        return "Inscription";
    }
  };

  const getFormTitle = () => {
    switch(accountType) {
      case 'particulier':
        return "Créez votre compte Acheteur";
      case 'professionnel':
        return "Créez votre compte Créateur";
      case 'entreprise':
        return "Créez votre compte Fournisseur";
      default:
        return "Créez votre compte";
    }
  };

  if (showFullForm) {
    // Formulaire complet d'inscription
    return (
      <div className="min-h-screen bg-white relative">
        <Header title={getHeaderTitle()} onBack={() => setShowFullForm(false)} />
        <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md px-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Titre du formulaire */}
              <div className="text-left">
                  <h2 className="text-2xl text-black font-lusitana mb-8">{getFormTitle()}</h2>
              </div>

              {/* Formulaire spécifique selon le type de compte */}
              {accountType === 'entreprise' ? (
                <>
                  {/* Champ Société */}
                  <div className="mb-8">
                    <Input
                      id="companyName"
                      type="text"
                      required
                      placeholder="Société"
                      icon={<CompanyIcon className="w-5 h-5" />}
                    />
                  </div>

                  {/* Champ N° Siret */}
                  <div className="mb-8">
                    <Input
                      id="siret"
                      type="text"
                      required
                      placeholder="N° Siret"
                      icon={<SiretIcon className="w-5 h-5" />}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Champ Prénom */}
                  <div className="mb-8">
                    <Input
                      id="firstName"
                      type="text"
                      required
                      placeholder="Prénom"
                      icon={<ProfilIcon className="w-5 h-5" />}
                    />
                  </div>

                  {/* Champ Nom */}
                  <div className="mb-8">
                    <Input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Nom"
                      icon={<ProfilIcon className="w-5 h-5" />}
                    />
                  </div>
                </>
              )}

              {/* Champ Email (commun à tous) */}
              <div className="mb-8">
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="e-mail"
                  icon={<EmailIcon className="w-5 h-5" />}
                />
              </div>

              {/* Champ Mot de passe (commun à tous) */}
              <div className="mb-8">
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  error={!!passwordError}
                  placeholder="Mot de Passe"
                  icon={<PasswordIcon className="w-5 h-5" />}
                />
              </div>

              {/* Champ Confirmation Mot de passe (commun à tous) */}
              <div className="mb-2">
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  error={!!passwordError}
                  placeholder="Confirmer le Mot de Passe"
                  icon={<PasswordIcon className="w-5 h-5" />}
                />
              </div>
              
              {/* Espace fixe toujours présent avec erreur en overlay */}
              <div className="relative mb-2">
                {/* Espace invisible qui garde toujours la place */}
                <div className="invisible text-sm font-montserrat">Erreur placeholder</div>
                
                {/* Texte d'erreur en position absolue par-dessus */}
                {passwordError && (
                  <div className="absolute top-0 left-0 text-rose-800 text-xs sm:font-semibold font-montserrat">
                    {passwordError}
                  </div>
                )}
              </div>

              {/* Champ Numéro de Téléphone avec code pays */}
              <div className="relative mb-8">
                <div className="flex">
                  {/* Sélecteur de code pays */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="pl-3 pr-2 py-2 text-black font-montserrat bg-input-bg border-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-zinc-500 border-r border-zinc-300"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  
                  {/* Champ numéro */}
                  <div className="relative flex-1">
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 text-black font-montserrat bg-input-bg border-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      placeholder="Numéro de téléphone"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton d'inscription */}
              <div className="mb-8">
                  <Button
                  type="submit"
                  className="w-full"
                  >
                  Confirmer
                  </Button>
              </div>

              {/* Bouton retour (desktop seulement) */}
              <div className="text-center hidden md:block">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowFullForm(false)}
                >
                  RETOUR
                </Button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Pré-menu de sélection
  return (
    <div className="min-h-screen bg-white relative">
      <Header title="Inscription" />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md px-8">
          <div className="space-y-6">
            {/* Titre */}
            <div className="text-left">
              <h2 className="text-2xl text-black font-lusitana mb-8">Commençons</h2>
            </div>

            {/* Type de compte */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-zinc-700 mb-2 font-montserrat">
                Type de compte
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full pl-3 pr-3 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                <option value="" disabled hidden>Type de compte</option>
                {accountTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Département */}
            <div className="mb-8 relative">
              <label className="block text-sm font-medium text-zinc-800 mb-2 font-montserrat">
                Choisissez votre localité
              </label>
              <p className="text-xs text-zinc-600 mb-4 font-montserrat wrap-break-word max-w-54">
                Département où sera façonné et livré votre vêtement
              </p>
              <Input
                type="text"
                id="department"
                value={departmentInput}
                onChange={handleDepartmentInputChange}
                onFocus={() => setShowSuggestions(departmentInput.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Tapez votre département"
              />
              
              {/* Liste des suggestions */}
              {showSuggestions && filteredDepartments.length > 0 && (
                <div className="absolute text-black z-10 w-full bg-white border border-zinc-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                  {filteredDepartments.slice(0, 5).map((dept) => (
                    <div
                      key={dept.code}
                      onClick={() => selectDepartment(dept)}
                      className="px-3 py-2 hover:bg-zinc-100 cursor-pointer font-montserrat text-sm"
                    >
                      {dept.code} - {dept.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton Continuer */}
            <div className="mb-8">
              <Button
                onClick={handleContinue}
                disabled={!accountType || !department}
                className="w-full"
              >
                Continuer
              </Button>
            </div>

            {/* Lien vers login */}
            <div className="text-center">
              <span className="text-sm font-montserrat text-zinc-800 font-medium">Déjà un compte ? </span>
              <a href="/login" className="text-sm font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors">
                SE CONNECTER
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
