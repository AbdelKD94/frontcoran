"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatusState";
import { getAyah, getSurah } from "@/lib/api";
import {
  NEUTRAL_REASON,
  ayahToFavorite,
  formatReference,
  getPreferredTranslation,
} from "@/lib/mappers";
import type { Ayah, Surah } from "@/lib/types";

export default function AyahDetailPage() {
  const params = useParams<{ surah: string; ayah: string }>();
  const surahNumber = Number(params.surah);
  const ayahNumber = Number(params.ayah);
  const [ayah, setAyah] = useState<Ayah | null>(null);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [previousAyah, setPreviousAyah] = useState<Ayah | null>(null);
  const [nextAyah, setNextAyah] = useState<Ayah | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(surahNumber) || !Number.isFinite(ayahNumber)) return;

    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return null;
        setLoading(true);
        setError(null);
        return Promise.all([getAyah(surahNumber, ayahNumber), getSurah(surahNumber, false)]);
      })
      .then(async (payload) => {
        if (!payload) return;
        const [ayahData, surahData] = payload;
        if (!active) return;
        const currentSurah = surahData as Surah;
        setAyah(ayahData);
        setSurah(currentSurah);

        const contextCalls: Promise<Ayah | null>[] = [];
        contextCalls.push(ayahNumber > 1 ? getAyah(surahNumber, ayahNumber - 1) : Promise.resolve(null));
        contextCalls.push(
          ayahNumber < (currentSurah.ayah_count ?? 0)
            ? getAyah(surahNumber, ayahNumber + 1)
            : Promise.resolve(null),
        );

        const [previous, next] = await Promise.all(
          contextCalls.map((call) => call.catch(() => null)),
        );
        if (active) {
          setPreviousAyah(previous);
          setNextAyah(next);
        }
      })
      .catch((apiError: Error) => {
        if (active) setError(apiError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ayahNumber, surahNumber]);

  const translation = useMemo(() => getPreferredTranslation(ayah?.translations), [ayah]);

  const copyVerse = async () => {
    if (!ayah) return;
    const text = `${formatReference(ayah.surah_number, ayah.ayah_number, surah?.name_latin)}\n${ayah.text_arabic}${translation ? `\n${translation.text}` : ""}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (loading) {
    return (
      <div className="page page-narrow">
        <LoadingState message="Chargement du verset..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page-narrow">
        <ErrorState title="Verset indisponible" message={error} />
      </div>
    );
  }

  if (!ayah) {
    return (
      <div className="page page-narrow">
        <EmptyState title="Verset introuvable" />
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <Link className="back-link" href={surah ? `/surahs/${surah.number}` : "/surahs"}>
        <ChevronLeft aria-hidden="true" />
        Retour
      </Link>

      <article className="verse-detail-card">
        <Image
          className="hero-motif"
          src="/brand/motifs/star-8.svg"
          alt=""
          width={150}
          height={150}
          aria-hidden="true"
          priority
        />
        <div className="card-meta">
          <span className="reference">
            {formatReference(ayah.surah_number, ayah.ayah_number, surah?.name_latin)}
          </span>
          <span className="verse-medallion">{ayah.ayah_number}</span>
        </div>
        <p className="arabic-text arabic-text-center">{ayah.text_arabic}</p>
        {translation && <p className="translation-text translation-center">« {translation.text} »</p>}
      </article>

      <div className="action-row">
        <AudioButton
          surahNumber={ayah.surah_number}
          ayahNumber={ayah.ayah_number}
          label="Écouter"
          className="button-like"
        />
        <button type="button" className="icon-button icon-button-large" onClick={copyVerse} aria-label="Copier">
          <Copy aria-hidden="true" />
        </button>
        <FavoriteButton item={ayahToFavorite(ayah, translation, surah)} />
      </div>
      {copied && <p className="inline-status">Verset copié.</p>}

      <div className="why-block">
        <span>Pourquoi ce verset ?</span>
        <p>{NEUTRAL_REASON}</p>
      </div>

      <section>
        <p className="eyebrow">Contexte</p>
        <div className="context-list">
          {previousAyah && (
            <ContextLink label="Verset précédent" ayah={previousAyah} surahName={surah?.name_latin} />
          )}
          {nextAyah && (
            <ContextLink label="Verset suivant" ayah={nextAyah} surahName={surah?.name_latin} />
          )}
          {!previousAyah && !nextAyah && <EmptyState title="Aucun contexte disponible" />}
        </div>
      </section>

      <section>
        <p className="eyebrow">Versets similaires</p>
        <EmptyState title="Aucun verset similaire disponible pour le moment." />
      </section>
    </div>
  );
}

function ContextLink({
  label,
  ayah,
  surahName,
}: {
  label: string;
  ayah: Ayah;
  surahName?: string | null;
}) {
  return (
    <Link className="context-row" href={`/ayah/${ayah.surah_number}/${ayah.ayah_number}`}>
      <span className="verse-medallion verse-medallion-emerald">{ayah.ayah_number}</span>
      <span>
        <small>{label}</small>
        <strong>{formatReference(ayah.surah_number, ayah.ayah_number, surahName)}</strong>
      </span>
      <span className="context-arabic" lang="ar" dir="rtl">
        {ayah.text_arabic}
      </span>
      <ChevronRight aria-hidden="true" />
    </Link>
  );
}
