import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f1e8,_#ffffff_65%)] text-zinc-900">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-zinc-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-lusitana text-xl tracking-[0.3em] text-cyan-950">
            SLOWMODE
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-istok-web uppercase tracking-wide text-zinc-700 lg:flex">
            <a href="#projet" className="hover:text-cyan-950 transition-colors">
              Projet
            </a>
            <a href="#methode" className="hover:text-cyan-950 transition-colors">
              Methode
            </a>
            <a href="#impact" className="hover:text-cyan-950 transition-colors">
              Impact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="rounded-full border border-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-950 transition-colors hover:bg-cyan-950 hover:text-white"
            >
              S&apos;inscrire
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-cyan-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-900"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-amber-100 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />

          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-montserrat uppercase tracking-[0.35em] text-zinc-600">
                Couture locale & tissu responsable
              </p>
              <h1 className="mt-4 text-4xl font-lusitana text-cyan-950 sm:text-5xl lg:text-6xl">
                La mode qui respecte votre style et la planete.
              </h1>
              <p className="mt-6 text-base font-istok-web leading-relaxed text-zinc-700">
                SlowMode connecte les clients, couturiers et fournisseurs de tissus de la meme localite.
                Choisissez votre vetement, votre tissu, puis co-creez la piece avec un artisan proche de chez vous.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/register"
                  className="rounded-full bg-cyan-950 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-cyan-900"
                >
                  Creer un compte
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-zinc-300 px-6 py-3 text-center text-sm font-semibold text-zinc-700 transition-colors hover:border-cyan-950 hover:text-cyan-950"
                >
                  Deja un compte
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 text-center text-xs font-montserrat uppercase tracking-widest text-zinc-500">
                <div className="rounded-2xl bg-white/70 px-3 py-4 shadow-sm">
                  Tissu certifie
                </div>
                <div className="rounded-2xl bg-white/70 px-3 py-4 shadow-sm">
                  Artisan local
                </div>
                <div className="rounded-2xl bg-white/70 px-3 py-4 shadow-sm">
                  Livraison sobre
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-[32px] bg-amber-100" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-cyan-100" />
              <div className="relative w-full overflow-hidden rounded-[36px] border border-white/60 bg-white/80 p-3 shadow-lg">
                <Image
                  src="/uploads/1767778118410-jsaeo4p.avif"
                  alt="Atelier local et tissus responsables"
                  width={640}
                  height={720}
                  className="h-full w-full rounded-[28px] object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="methode" className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-montserrat uppercase tracking-[0.35em] text-zinc-500">
                La methode
              </p>
              <h2 className="mt-3 text-4xl font-lusitana text-cyan-950">
                Trois etapes pour redonner du sens.
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  step: "1.",
                  title: "Choisissez",
                  text: "Selectionnez le vetement, le tissu et le couturier proches de chez vous.",
                },
                {
                  step: "2.",
                  title: "Ajustez",
                  text: "Discutez avec l'artisan pour affiner les details et valider la piece.",
                },
                {
                  step: "3.",
                  title: "Recevez",
                  text: "Le tissu arrive a l'atelier, puis votre creation revient chez vous.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="text-4xl font-lusitana text-cyan-950">{item.step}</div>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm font-istok-web text-zinc-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projet" className="bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-montserrat uppercase tracking-[0.35em] text-zinc-500">
                  Presentation du projet
                </p>
                <h2 className="mt-3 text-4xl font-lusitana text-cyan-950">
                  Relier les talents locaux, du tissu a la livraison.
                </h2>
                <p className="mt-4 text-base font-istok-web leading-relaxed text-zinc-700">
                  SlowMode est une application de mise en relation entre des couturiers, des clients
                  d'une meme localite et des fournisseurs de tissus. Le client choisit le vetement,
                  le tissu et l'artisan avec qui il peut echanger pour ajuster la piece. Le tissu
                  est envoye au couturier, puis le vetement fini est renvoye au client.
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    title: "Dialogue direct",
                    text: "Un fil de discussion pour definir mesures, finitions et delais.",
                  },
                  {
                    title: "Tissus certifies",
                    text: "Des fournisseurs locaux et des matieres sourcees avec transparence.",
                  },
                  {
                    title: "Suivi simple",
                    text: "Un tableau de bord clair pour chaque commande et chaque etape.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                    <h3 className="text-base font-semibold text-zinc-900">{item.title}</h3>
                    <p className="mt-2 text-sm font-istok-web text-zinc-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="relative overflow-hidden bg-cyan-950 text-white">
          <div className="pointer-events-none absolute -left-16 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 bottom-8 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-montserrat uppercase tracking-[0.35em] text-white/70">
                  Message ecologique
                </p>
                <h2 className="mt-3 text-4xl font-lusitana text-white">
                  Stopper la fast fashion, valoriser la couture locale.
                </h2>
                <p className="mt-4 text-base font-istok-web leading-relaxed text-white/80">
                  La fast fashion alimente la surproduction, ecrase les travailleurs et multiplie
                  les transports inutiles. SlowMode defend un modele de proximite : chaque piece est
                  faite sur mesure, avec des tissus mieux traces, pour reduire l'impact carbone.
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  "Des milliards de vetements produits chaque annee, souvent jetables.",
                  "Des teintures chimiques, microplastiques et pesticides qui polluent l'eau.",
                  "Un jean peut consommer plus de 7 000 litres d eau.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-5">
                    <p className="text-sm font-istok-web leading-relaxed text-white/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-10 rounded-[32px] border border-zinc-100 bg-white p-8 md:flex-row md:items-center">
            <div className="flex-1">
              <p className="text-sm font-montserrat uppercase tracking-[0.35em] text-zinc-500">
                Faire autrement
              </p>
              <h2 className="mt-3 text-3xl font-lusitana text-cyan-950">
                Construisons une garde-robe plus juste.
              </h2>
              <p className="mt-4 text-sm font-istok-web text-zinc-600">
                Inscrivez-vous pour decouvrir les couturiers de votre zone, dialoguer et creer des
                vetements penses pour durer.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/register"
                className="rounded-full bg-cyan-950 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-cyan-900"
              >
                S&apos;inscrire
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-zinc-300 px-6 py-3 text-center text-sm font-semibold text-zinc-700 transition-colors hover:border-cyan-950 hover:text-cyan-950"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
