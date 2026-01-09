import React from "react";
import Link from "next/link";

export default function CGUPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-semibold">Conditions Générales d'Utilisation (CGU)</h1>

      <p className="mb-4">Bienvenue sur la plateforme SLOWMODE. Les présentes Conditions Générales d'Utilisation ("CGU") régissent l'accès et l'utilisation des services proposés par la plateforme.</p>

      <h2 className="mt-6 mb-2 text-xl font-medium">1. Acceptation</h2>
      <p className="mb-4">En accédant ou en utilisant la plateforme, vous acceptez d'être lié par ces CGU. Si vous n'acceptez pas ces conditions, n'utilisez pas le service.</p>

      <h2 className="mt-6 mb-2 text-xl font-medium">2. Accès au service</h2>
      <p className="mb-4">L'accès aux APIs et aux fonctionnalités nécessite la création d'un compte et une authentification. Certaines actions sont réservées à des types de comptes spécifiques (couturiers, fournisseurs, acheteurs).</p>

      <h2 className="mt-6 mb-2 text-xl font-medium">3. Utilisation autorisée</h2>
      <p className="mb-4">Vous vous engagez à utiliser la plateforme de manière loyale et conforme aux lois en vigueur. Vous ne devez pas utiliser le service pour :
      </p>
      <ul className="mb-4 ml-6 list-disc">
        <li>réaliser des activités illégales ;</li>
        <li>tenter de contourner les mécanismes d'authentification ou de sécurité ;</li>
        <li>collecter massivement des données sans autorisation.</li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-medium">4. Interdiction d'automatisation et de spam</h2>
      <p className="mb-4">L'utilisation automatisée (bots, scripts de scraping, flooding) est strictement interdite sans accord explicite. Le spam et les requêtes massives non autorisées sont prohibés. Toute utilisation abusive pourra entraîner une suspension ou un blocage d'accès. Cette plateforme promeut une utilisation responsable : les requêtes inutiles augmentent l'empreinte environnementale et nuisent à la communauté.</p>

      <h2 className="mt-6 mb-2 text-xl font-medium">5. Contenu et responsabilité</h2>
      <p className="mb-4">Les utilisateurs sont responsables du contenu qu'ils publient. Nous ne pouvons garantir l'exactitude des informations fournies par des tiers. La plateforme ne pourra être tenue responsable des dommages indirects résultant de l'utilisation du service.</p>

      <h2 className="mt-6 mb-2 text-xl font-medium">6. Protection des données & RGPD</h2>
      <p className="mb-4">Les données personnelles sont traitées conformément à la politique de confidentialité et au Règlement Général sur la Protection des Données (RGPD). Nous mettons en place des mesures techniques et organisationnelles raisonnables pour protéger vos données (hachage des mots de passe, accès restreint, sauvegardes sécurisées).</p>

      <h3 className="mt-4 mb-2 text-lg font-medium">Droits des personnes</h3>
      <p className="mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul className="mb-4 ml-6 list-disc">
        <li>Droit d'accès : obtenir une copie des données vous concernant ;</li>
        <li>Droit de rectification : corriger des données inexactes ou incomplètes ;</li>
        <li>Droit à l'effacement (droit à l'oubli) : demander la suppression de vos données dans les limites légales ;</li>
        <li>Droit à la limitation du traitement : demander la suspension du traitement de vos données ;</li>
        <li>Droit d'opposition : vous opposer au traitement pour des motifs légitimes ;</li>
        <li>Droit à la portabilité : recevoir vos données dans un format structuré et couramment utilisé.</li>
      </ul>

      <h3 className="mt-4 mb-2 text-lg font-medium">Comment exercer vos droits</h3>
      <p className="mb-4">Pour exercer vos droits, contactez le délégué à la protection des données ou l'équipe support via le formulaire de contact dans l'application ou par email à l'adresse de support mentionnée. Nous répondrons dans les délais prévus par la réglementation (généralement dans un délai d'un mois).</p>

      <h3 className="mt-4 mb-2 text-lg font-medium">Base légale et finalités</h3>
      <p className="mb-4">Les données sont traitées pour assurer le fonctionnement du service (authentification, gestion des commandes, communications liées au service) et sur la base légale nécessaire (exécution du contrat, consentement, intérêts légitimes selon les cas).</p>

      <h3 className="mt-4 mb-2 text-lg font-medium">Conservation des données</h3>
      <p className="mb-4">Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et conformément aux obligations légales applicables. Certaines données (ex : historiques de commandes) peuvent être archivées pour la tenue des comptes et obligations fiscales.</p>

      <h3 className="mt-4 mb-2 text-lg font-medium">Cookies et suivi</h3>
      <p className="mb-4">Nous utilisons des cookies techniques pour le bon fonctionnement du site et, le cas échéant, des cookies analytiques avec votre consentement. Vous pouvez gérer vos préférences cookies via les paramètres du navigateur ou l'interface proposée sur le site.</p>

      <h3 className="mt-4 mb-2 text-lg font-medium">Contact du responsable de traitement</h3>
      <p className="mb-4">Le responsable du traitement est l'équipe SLOWMODE. Pour toute question RGPD ou réclamation, contactez le support à : <a href="mailto:contact@slowmode.app" className="text-cyan-900 underline">contact@slowmode.app</a></p>

      <h2 className="mt-6 mb-2 text-xl font-medium">7. Modifications des CGU</h2>
      <p className="mb-4">Nous pouvons modifier ces CGU à tout moment. Les modifications seront publiées sur cette page avec la date de mise à jour. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.</p>

      <h2 className="mt-6 mb-2 text-xl font-medium">8. Contact</h2>
      <p className="mb-4">Pour toute question relative aux CGU ou pour exercer vos droits RGPD, contactez l'équipe support :</p>
      <p className="mb-4">Email : <a href="mailto:contact@slowmode.app" className="text-cyan-900 underline">contact@slowmode.app</a></p>

      <div className="mt-8 flex items-center gap-4">
        <Link href="/" className="text-sm text-cyan-900 underline">Retour à l'accueil</Link>
      </div>
    </main>
  );
}
