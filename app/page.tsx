"use client";

import { BookOpen, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GuidanceSearchBox } from "@/components/guidance/GuidanceSearchBox";
import { SpiritualDisclaimer } from "@/components/guidance/SpiritualDisclaimer";
import { SuggestionChips } from "@/components/search/SuggestionChips";
import { EmptyState, ErrorState } from "@/components/ui/StatusState";
import { getHealth } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(() => setBackendError(null))
      .catch((error: Error) => setBackendError(error.message));
  }, []);

  const submitSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationMessage("Écris une phrase ou choisis une suggestion pour commencer.");
      return;
    }
    setValidationMessage(null);
    setLoading(true);
    router.push(`/guidance?query=${encodeURIComponent(trimmed)}`);
  };

  const selectSuggestion = (value: string) => {
    setQuery(value);
    setValidationMessage(null);
  };

  return (
    <div className="page page-narrow">
      <section className="explore-hero">
        <Image
          className="hero-motif"
          src="/brand/motifs/star-8.svg"
          alt=""
          width={150}
          height={150}
          aria-hidden="true"
          priority
        />
        <div>
          <p className="eyebrow">QuranLens</p>
          <h1>Que cherches-tu dans le Coran aujourd’hui ?</h1>
          <p className="hero-copy">
            Décris une situation, une émotion, une question ou un thème. QuranLens te
            propose des passages pertinents à explorer.
          </p>
        </div>

        <div ref={inputRef}>
          <GuidanceSearchBox
            value={query}
            onChange={setQuery}
            onSubmit={submitSearch}
            loading={loading}
          />
        </div>

        {validationMessage && (
          <EmptyState title="Recherche vide" message={validationMessage} />
        )}

        <div className="suggestion-block">
          <p className="eyebrow">Suggestions</p>
          <SuggestionChips onSelect={selectSuggestion} />
        </div>

        <SpiritualDisclaimer />
      </section>

      {backendError && (
        <ErrorState
          title="Backend indisponible"
          message="Impossible de contacter le backend QuranLens. Vérifiez que l'API est lancée sur http://localhost:8010."
        />
      )}

      <section className="quick-grid" aria-label="Accès rapide">
        <button
          type="button"
          className="quick-card"
          onClick={() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
        >
          <Compass aria-hidden="true" />
          <span>
            <strong>Explorer par le sens</strong>
            <small>Décris ce que tu traverses.</small>
          </span>
        </button>
        <Link className="quick-card quick-card-gold" href="/surahs">
          <BookOpen aria-hidden="true" />
          <span>
            <strong>Consulter le Coran</strong>
            <small>Sourate par sourate.</small>
          </span>
        </Link>
      </section>
    </div>
  );
}
