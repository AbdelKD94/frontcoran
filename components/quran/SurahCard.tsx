import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDisplayRevelationPlace } from "@/lib/mappers";
import type { Surah } from "@/lib/types";

type SurahCardProps = {
  surah: Surah;
};

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link className="surah-row" href={`/surahs/${surah.number}`}>
      <span className="verse-medallion verse-medallion-emerald">{surah.number}</span>
      <span className="surah-row-main">
        <strong>{surah.name_latin}</strong>
        <span>
          {getDisplayRevelationPlace(surah.revelation_place)} · {surah.ayah_count ?? 0} versets
        </span>
      </span>
      <span className="surah-arabic" lang="ar" dir="rtl">
        {surah.name_arabic}
      </span>
      <ChevronRight aria-hidden="true" className="row-chevron" />
    </Link>
  );
}
