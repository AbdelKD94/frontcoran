"use client";

import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { EmptyState } from "@/components/ui/StatusState";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { items, removeFavorite } = useFavorites();

  return (
    <div className="page page-narrow">
      <div className="screen-heading">
        <p className="eyebrow">Favoris</p>
        <h1>Versets enregistrés</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun favori pour le moment"
          message="Enregistrez un verset pour le retrouver ici."
        />
      ) : (
        <div className="result-stack">
          {items.map((item) => (
            <article className="result-card" key={item.id}>
              <div className="card-meta">
                <span className="reference">{item.reference}</span>
                <span className="verse-medallion">{item.ayahNumber}</span>
              </div>
              {item.arabicText && <p className="arabic-text">{item.arabicText}</p>}
              {item.translationFr && <p className="translation-text">{item.translationFr}</p>}
              <div className="card-actions">
                <Link
                  className="secondary-action"
                  href={`/ayah/${item.surahNumber}/${item.ayahNumber}`}
                >
                  Voir détail
                  <ChevronRight aria-hidden="true" />
                </Link>
                <AudioButton surahNumber={item.surahNumber} ayahNumber={item.ayahNumber} />
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Supprimer le favori"
                  onClick={() => removeFavorite(item)}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
