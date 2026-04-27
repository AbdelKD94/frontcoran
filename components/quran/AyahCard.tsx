import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { ayahToFavorite, getPreferredTranslation } from "@/lib/mappers";
import type { Ayah, Surah } from "@/lib/types";

type AyahCardProps = {
  ayah: Ayah;
  surah?: Surah | null;
};

export function AyahCard({ ayah, surah }: AyahCardProps) {
  const translation = getPreferredTranslation(ayah.translations);

  return (
    <article className="ayah-card">
      <div className="card-meta">
        <span className="verse-medallion">{ayah.ayah_number}</span>
        <div className="ayah-card-actions">
          <Link
            className="text-link"
            href={`/ayah/${ayah.surah_number}/${ayah.ayah_number}`}
          >
            Détail
          </Link>
          <AudioButton surahNumber={ayah.surah_number} ayahNumber={ayah.ayah_number} />
          <FavoriteButton item={ayahToFavorite(ayah, translation, surah)} size="sm" />
          <button className="icon-button icon-button-sm" type="button" aria-label="Options">
            <MoreHorizontal aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="arabic-text">{ayah.text_arabic}</p>
      {translation && <p className="translation-text">{translation.text}</p>}
    </article>
  );
}
