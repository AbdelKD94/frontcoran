"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { SearchBar } from "@/components/search/SearchBar";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatusState";
import { formatReference, resultToFavorite } from "@/lib/mappers";
import { searchQuranText } from "@/lib/api";
import type { SearchResponse } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (value: string) => {
    setLoading(true);
    setError(null);
    try {
      setData(await searchQuranText(value, "fr", 20));
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Recherche impossible.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-narrow">
      <div className="screen-heading">
        <p className="eyebrow">Recherche textuelle</p>
        <h1>Recherche classique</h1>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={submit}
        loading={loading}
        placeholder="Rechercher un mot ou une expression..."
      />

      {loading && <LoadingState message="Recherche dans les versets et traductions..." />}
      {error && <ErrorState title="Recherche impossible" message={error} />}

      {!loading && !error && data && (
        <section className="results-section">
          <div className="section-title-row">
            <h2>Résultats</h2>
            <span>{data.total} résultat{data.total > 1 ? "s" : ""}</span>
          </div>

          {data.results.length === 0 ? (
            <EmptyState
              title="Aucun résultat trouvé"
              message="Essayez un autre mot ou une autre expression."
            />
          ) : (
            <div className="result-stack">
              {data.results.map((result, index) => (
                <article className="result-card fade-in" key={`${result.surah_number}-${result.ayah_number}-${index}`}>
                  <div className="card-meta">
                    <span className="reference">
                      {formatReference(result.surah_number, result.ayah_number, result.surah_name_latin)}
                    </span>
                    <span className="verse-medallion">{result.ayah_number}</span>
                  </div>
                  <p className="arabic-text">{result.text_arabic}</p>
                  {result.translation && <p className="translation-text">{result.translation}</p>}
                  <div className="card-actions">
                    <Link
                      className="secondary-action"
                      href={`/ayah/${result.surah_number}/${result.ayah_number}`}
                    >
                      Voir détail
                      <ChevronRight aria-hidden="true" />
                    </Link>
                    <AudioButton surahNumber={result.surah_number} ayahNumber={result.ayah_number} />
                    <FavoriteButton item={resultToFavorite(result)} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
