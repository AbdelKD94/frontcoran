import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { WhyThisResultBox } from "@/components/guidance/WhyThisResultBox";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { guidanceResultToFavorite } from "@/lib/mappers";
import type { GuidanceResult } from "@/lib/types";

type GuidanceResultCardProps = {
  result: GuidanceResult;
  delay?: number;
};

export function GuidanceResultCard({ result, delay = 0 }: GuidanceResultCardProps) {
  return (
    <article className="result-card fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="card-meta">
        <span className="reference">{result.reference}</span>
        <span className="verse-medallion">{result.ayahNumber}</span>
      </div>

      {result.arabicText && (
        <p className="arabic-text" lang="ar" dir="rtl">
          {result.arabicText}
        </p>
      )}

      {result.translationFr && <p className="translation-text">« {result.translationFr} »</p>}

      <WhyThisResultBox reason={result.reason} />

      <div className="result-footer">
        {result.themes.length > 0 && (
          <div className="tag-row">
            {result.themes.map((theme) => (
              <span key={theme} className="tag">
                {theme}
              </span>
            ))}
          </div>
        )}
        {typeof result.score === "number" && (
          <span className="score-label">Pertinence {(result.score * 100).toFixed(0)} %</span>
        )}
      </div>

      <div className="card-actions">
        <Link className="secondary-action" href={`/ayah/${result.surahNumber}/${result.ayahNumber}`}>
          Voir détail
          <ChevronRight aria-hidden="true" />
        </Link>
        <AudioButton surahNumber={result.surahNumber} ayahNumber={result.ayahNumber} />
        <FavoriteButton item={guidanceResultToFavorite(result)} />
      </div>
    </article>
  );
}
