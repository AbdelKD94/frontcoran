"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DetectedThemesCard } from "@/components/guidance/DetectedThemesCard";
import { EmptyGuidanceState, ErrorGuidanceState, LoadingGuidanceState } from "@/components/guidance/GuidanceStates";
import { ExploreMoreSection } from "@/components/guidance/ExploreMoreSection";
import { GuidanceResultCard } from "@/components/guidance/GuidanceResultCard";
import { GuidanceSearchBox } from "@/components/guidance/GuidanceSearchBox";
import { SensitiveQueryNotice } from "@/components/guidance/SensitiveQueryNotice";
import { SpiritualDisclaimer } from "@/components/guidance/SpiritualDisclaimer";
import { SuggestedQueriesSection } from "@/components/guidance/SuggestedQueriesSection";
import { guidanceSearch } from "@/lib/api";
import { detectFrenchThemes } from "@/lib/guidance";
import type { GuidanceSearchResponse } from "@/lib/types";

export function GuidanceExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") ?? "";
  const retryToken = searchParams.get("retry") ?? "";
  const [data, setData] = useState<GuidanceSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const trimmedQuery = initialQuery.trim();

  useEffect(() => {
    if (!trimmedQuery) {
      return;
    }

    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return null;
        setLoading(true);
        setError(null);
        setValidationMessage(null);
        return guidanceSearch(trimmedQuery, { language: "fr", limit: 10 });
      })
      .then((response) => {
        if (active && response) setData(response);
      })
      .catch((apiError: Error) => {
        if (active) {
          setError(apiError.message);
          setData(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryToken, trimmedQuery]);

  const activeData = data?.query === trimmedQuery ? data : null;
  const detected = useMemo(
    () => activeData?.detected ?? detectFrenchThemes(trimmedQuery),
    [activeData, trimmedQuery],
  );
  const activeError = trimmedQuery ? error : null;

  const launchSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationMessage("Écris une phrase ou choisis une suggestion pour commencer.");
      return;
    }

    setValidationMessage(null);
    router.push(`/guidance?query=${encodeURIComponent(trimmed)}`);
  };

  const retry = () => {
    if (trimmedQuery) {
      router.replace(`/guidance?query=${encodeURIComponent(trimmedQuery)}&retry=${Date.now()}`);
    }
  };

  return (
    <div className="page page-narrow guidance-page">
      <div className="screen-heading">
        <p className="eyebrow">Explorer par le sens</p>
        <h1>Passages à explorer</h1>
        {trimmedQuery && (
          <p className="screen-subtitle">
            Recherche : <strong>{trimmedQuery}</strong>
          </p>
        )}
      </div>

      <GuidanceSearchBox
        key={initialQuery}
        defaultValue={initialQuery}
        onSubmit={launchSearch}
        loading={loading}
        compact
        placeholder="Décris une situation, une émotion ou un thème..."
      />

      {validationMessage && (
        <EmptyGuidanceState title="Recherche vide" message={validationMessage} />
      )}

      {!trimmedQuery && !validationMessage && (
        <EmptyGuidanceState
          title="Aucune recherche lancée"
          message="Saisissez une phrase naturelle pour trouver des passages par le sens."
        />
      )}

      {trimmedQuery && (
        <>
          <DetectedThemesCard detected={detected} />
          {detected.isSensitive && <SensitiveQueryNotice />}
          <SpiritualDisclaimer />
        </>
      )}

      {loading && <LoadingGuidanceState />}

      {activeError && (
        <ErrorGuidanceState
          title="Impossible de contacter le backend QuranLens."
          message={activeError || "Vérifiez que l’API est lancée."}
          onRetry={retry}
        />
      )}

      {!loading && !activeError && activeData && (
        <>
          <section className="results-section">
            <div className="section-title-row">
              <h2>Passages les plus pertinents</h2>
              <span>{activeData.total} résultat{activeData.total > 1 ? "s" : ""}</span>
            </div>

            {activeData.results.length === 0 ? (
              <EmptyGuidanceState />
            ) : (
              <div className="result-stack">
                {activeData.results.map((result, index) => (
                  <GuidanceResultCard key={`${result.id}-${index}`} result={result} delay={index * 60} />
                ))}
              </div>
            )}
          </section>

          <ExploreMoreSection queries={activeData.exploreMore} onSelect={launchSearch} />
          <SuggestedQueriesSection queries={activeData.suggestedQueries} onSelect={launchSearch} />
        </>
      )}
    </div>
  );
}
