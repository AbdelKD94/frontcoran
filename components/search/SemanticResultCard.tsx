import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import {
  formatReference,
  getResultScore,
  resultToFavorite,
} from "@/lib/mappers";
import type { SemanticSearchResult } from "@/lib/types";

type SemanticResultCardProps = {
  result: SemanticSearchResult;
  delay?: number;
};

export function SemanticResultCard({ result, delay = 0 }: SemanticResultCardProps) {
  const score = getResultScore(result);
  const themes = result.themes ?? [];
  const reference = formatReference(
    result.surah_number,
    result.ayah_number,
    result.surah_name_latin,
  );

  return (
    <article className="result-card fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="card-meta">
        <span className="reference">{reference}</span>
        <span className="verse-medallion">{result.ayah_number}</span>
      </div>

      <p className="arabic-text">{result.text_arabic}</p>

      {result.translation && <p className="translation-text">« {result.translation} »</p>}

      <div className="why-block">
        <span>Pourquoi ce résultat ?</span>
        <p>{result.reason}</p>
      </div>

      <div className="result-footer">
        {themes.length > 0 && (
          <div className="tag-row">
            {themes.map((theme) => (
              <span key={theme} className="tag">
                {theme}
              </span>
            ))}
          </div>
        )}
        {score !== null && (
          <span className="score-label">Pertinence {(score * 100).toFixed(0)} %</span>
        )}
      </div>

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
  );
}
