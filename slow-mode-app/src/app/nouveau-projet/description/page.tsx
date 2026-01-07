"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

export default function DescriptionProjetPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [description, setDescription] = useState("");

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

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
    setActiveIndex((prev) =>
      Math.min(prev, Math.max(0, previews.length - 2))
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f1f6] font-montserrat text-[#1e1b24]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-24 pt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#3c2a5d]">
          Etape 4 sur 5
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#dcd7e3]">
          <div className="h-full w-4/5 rounded-full bg-[#3c2a5d]" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold text-[#1e1b24]">
            Décrivez votre besoin
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#3a3640]">
            Donnez un maximum de détails à votre couturier pour qu'il puisse
            comprendre l'esprit de votre projet.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-2xl border border-[#ded9e6] bg-white text-[#1e1b24] shadow-sm"
            onClick={() => inputRef.current?.click()}
          >
            <svg
              width="34"
              height="28"
              viewBox="0 0 34 28"
              fill="none"
              aria-hidden="true"
            >
              <rect x="3" y="6" width="28" height="19" rx="4" stroke="#1e1b24" strokeWidth="2" />
              <path d="M11 6l2-3h8l2 3" stroke="#1e1b24" strokeWidth="2" strokeLinecap="round" />
              <circle cx="17" cy="15" r="5" stroke="#1e1b24" strokeWidth="2" />
            </svg>
            <span className="text-3xl leading-none">+</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <p className="text-center text-sm text-[#2d2a33]">
            Choisir une ou plusieurs images de votre vêtement ou idée
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
                  ‹
                </button>
              )}
              <div className="flex w-full justify-center gap-3">
                {visible.map((src, index) => {
                  const absoluteIndex = activeIndex + index;
                  return (
                    <div key={`${src}-${index}`} className="relative">
                      <img
                        src={src}
                        alt=""
                        className="h-20 w-20 rounded-xl object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemove(absoluteIndex)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm text-[#1e1b24] shadow"
                        aria-label="Supprimer cette image"
                      >
                        ×
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
                  ›
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
            className="h-40 w-full rounded-2xl bg-[#e3dfe8] p-4 text-sm text-[#1e1b24] placeholder:text-[#7b7586] focus:outline-none"
          />
        </div>

        <div className="mt-6">
          <Link
            href={`/nouveau-projet/mensurations${category ? `?category=${category}` : ""}`}
            className="block w-full rounded-full bg-[#3c2a5d] py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#34214f]"
          >
            Continuer
          </Link>
        </div>
      </div>

      <BottomNavClientWrapper />
    </div>
  );
}
