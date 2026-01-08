"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DescriptionProjetPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;
    setFiles((prev) => [...prev, ...selected]);
  };

  const canScroll = previews.length > 3;
  const visible = previews.slice(activeIndex, activeIndex + 3);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(previews.length - 3, prev + 1));
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((prev) => Math.min(prev, Math.max(0, previews.length - 2)));
  };

  const handleContinue = async () => {
    setErrorMessage(null);
    const draft = JSON.parse(localStorage.getItem("projetDraft") || "{}");
    let uploadedImages = draft.images || [];

    if (files.length > 0) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const res = await fetch("/api/projet/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Upload images erreur:", errorText);
          setErrorMessage("Impossible d'envoyer les images. Reessayez.");
          return;
        }
        let json: { success?: boolean; paths?: string[] } | null = null;
        try {
          json = await res.json();
        } catch (error) {
          console.error("Upload images erreur:", error);
          setErrorMessage("Reponse inattendue du serveur lors de l'upload.");
          return;
        }
        if (!json?.success || !json.paths) {
          setErrorMessage("Impossible d'envoyer les images. Reessayez.");
          return;
        }
        uploadedImages = json.paths;
      } catch (error) {
        console.error("Upload images erreur:", error);
        setErrorMessage("Erreur reseau lors de l'upload.");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    localStorage.setItem(
      "projetDraft",
      JSON.stringify({
        ...draft,
        description,
        images: uploadedImages,
        categorie: category ?? draft.categorie,
      })
    );

    router.push(`/nouveau-projet/mensurations${category ? `?category=${category}` : ""}`);
  };

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Etape 4 sur 5
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-zinc-200">
          <div className="h-full w-4/5 rounded-full bg-cyan-950" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-lusitana text-cyan-950">Decrivez votre besoin</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Donnez un maximum de details a votre couturier pour qu'il puisse comprendre l'esprit de
            votre projet.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm"
            onClick={() => inputRef.current?.click()}
          >
            <svg width="34" height="28" viewBox="0 0 34 28" fill="none" aria-hidden="true">
              <rect x="3" y="6" width="28" height="19" rx="4" stroke="#111827" strokeWidth="2" />
              <path d="M11 6l2-3h8l2 3" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              <circle cx="17" cy="15" r="5" stroke="#111827" strokeWidth="2" />
            </svg>
            <span className="text-3xl leading-none">+</span>
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          <p className="text-center text-sm text-zinc-600">
            Choisir une ou plusieurs images de votre vetement ou idee.
          </p>
        </div>

        {previews.length > 0 && (
          <div className="mt-6">
            <div className="relative flex items-center justify-center gap-3">
              {canScroll && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className="absolute -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow disabled:opacity-40"
                >
                  {"<"}
                </button>
              )}
              <div className="flex w-full justify-center gap-3">
                {visible.map((src, index) => {
                  const absoluteIndex = activeIndex + index;
                  return (
                    <div key={`${src}-${index}`} className="relative">
                      <img src={src} alt="" className="h-20 w-20 rounded-xl object-cover shadow-sm" />
                      <button
                        type="button"
                        onClick={() => handleRemove(absoluteIndex)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm text-zinc-900 shadow"
                        aria-label="Supprimer cette image"
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
              {canScroll && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={activeIndex >= previews.length - 3}
                  className="absolute -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow disabled:opacity-40"
                >
                  {">"}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Je souhaite transformer cette robe longue en jupe mi-longue..."
            className="h-40 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
          />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-full bg-cyan-950 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900 disabled:opacity-60"
            disabled={isUploading}
          >
            {isUploading ? "Upload..." : "Continuer"}
          </button>
          {errorMessage && <p className="mt-3 text-center text-xs text-rose-600">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}
