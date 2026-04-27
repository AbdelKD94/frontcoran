"use client";

import Link from "next/link";
import { ChevronLeft, Play } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AyahCard } from "@/components/quran/AyahCard";
import { ErrorState, LoadingState } from "@/components/ui/StatusState";
import { getSurah } from "@/lib/api";
import { getDisplayRevelationPlace } from "@/lib/mappers";
import type { SurahDetail } from "@/lib/types";

export default function SurahDetailPage() {
  const params = useParams<{ number: string }>();
  const number = Number(params.number);
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(number)) return;

    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return null;
        setLoading(true);
        setError(null);
        return getSurah(number, true);
      })
      .then((data) => {
        if (active && data) setSurah(data as SurahDetail);
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
  }, [number]);

  if (loading) {
    return (
      <div className="page page-narrow">
        <LoadingState message="Chargement de la sourate..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page-narrow">
        <ErrorState title="Sourate indisponible" message={error} />
      </div>
    );
  }

  if (!surah) {
    return null;
  }

  return (
    <div className="page page-narrow page-with-player">
      <Link className="back-link" href="/surahs">
        <ChevronLeft aria-hidden="true" />
        Retour
      </Link>

      <section className="surah-hero">
        <Image
          className="hero-motif"
          src="/brand/motifs/star-8.svg"
          alt=""
          width={150}
          height={150}
          aria-hidden="true"
          priority
        />
        <p className="surah-title-arabic" lang="ar" dir="rtl">
          {surah.name_arabic}
        </p>
        <h1>{surah.name_latin}</h1>
        <p>
          {getDisplayRevelationPlace(surah.revelation_place)} · {surah.ayah_count ?? 0} versets
        </p>
      </section>

      <section className="ayah-stack" aria-label={`Versets de ${surah.name_latin}`}>
        {surah.ayahs.map((ayah) => (
          <AyahCard key={ayah.ayah_number} ayah={ayah} surah={surah} />
        ))}
      </section>

      <div className="mini-player" role="status">
        <div>
          <strong>Écouter la sourate {surah.name_latin}</strong>
          <span>Audio bientôt disponible</span>
        </div>
        <button type="button" className="icon-button" aria-label="Audio bientôt disponible" disabled>
          <Play aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
