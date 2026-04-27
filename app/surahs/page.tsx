"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SurahCard } from "@/components/quran/SurahCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatusState";
import { getSurahs } from "@/lib/api";
import type { Surah } from "@/lib/types";

function normalizeFilterValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff]/g, "")
    .replace(/(.)\1+/g, "$1");
}

export default function SurahsPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSurahs()
      .then(setSurahs)
      .catch((apiError: Error) => setError(apiError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredSurahs = useMemo(() => {
    const value = normalizeFilterValue(filter.trim());
    if (!value) return surahs;

    return surahs.filter((surah) => {
      const latin = normalizeFilterValue(surah.name_latin);
      const arabic = normalizeFilterValue(surah.name_arabic);
      return (
        String(surah.number).includes(value) ||
        latin.includes(value) ||
        arabic.includes(value)
      );
    });
  }, [filter, surahs]);

  return (
    <div className="page page-narrow">
      <div className="screen-heading">
        <p className="eyebrow">Coran</p>
        <h1>Consulter le Coran</h1>
      </div>

      <SearchBar
        value={filter}
        onChange={setFilter}
        onSubmit={setFilter}
        compact
        placeholder="Rechercher une sourate..."
      />

      {loading && <LoadingState message="Chargement des sourates..." />}
      {error && <ErrorState title="Sourates indisponibles" message={error} />}

      {!loading && !error && (
        <section className="surah-list">
          {filteredSurahs.length === 0 ? (
            <EmptyState
              title="Aucune sourate trouvée"
              message="Essayez avec un numéro, un nom latin ou un nom arabe."
            />
          ) : (
            filteredSurahs.map((surah) => <SurahCard key={surah.number} surah={surah} />)
          )}
        </section>
      )}
    </div>
  );
}
