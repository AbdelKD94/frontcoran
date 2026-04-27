import type {
  Ayah,
  FavoriteItem,
  GuidanceQueryAnalysis,
  GuidanceResult,
  GuidanceSearchResponse,
  SearchResult,
  SemanticSearchResponse,
  SemanticSearchResult,
  Surah,
  SurahDetail,
  Translation,
} from "@/lib/types";
import {
  detectFrenchThemes,
  getExploreMoreQueries,
  getReasonForThemes,
  getSuggestedReformulations,
} from "@/lib/guidance";

export const NEUTRAL_REASON =
  "Ce passage ressort comme pertinent par proximité sémantique avec votre recherche.";

function cleanText(value: string) {
  return value.replace(/^\uFEFF/, "");
}

export function normalizeSurah(surah: Surah): Surah {
  return {
    ...surah,
    name_arabic: cleanText(surah.name_arabic),
    ayah_count: surah.ayah_count ?? 0,
  };
}

export function normalizeAyah(ayah: Ayah): Ayah {
  return {
    ...ayah,
    text_arabic: cleanText(ayah.text_arabic),
    text_uthmani: ayah.text_uthmani ? cleanText(ayah.text_uthmani) : ayah.text_uthmani,
  };
}

export function normalizeSurahDetail(surah: SurahDetail): SurahDetail {
  return {
    ...normalizeSurah(surah),
    ayahs: [...(surah.ayahs ?? [])]
      .map(normalizeAyah)
      .sort((a, b) => a.ayah_number - b.ayah_number),
  };
}

export function getDisplayRevelationPlace(place?: string | null): string {
  const normalized = (place ?? "").trim().toLowerCase();

  if (["meccan", "makkah", "mecquoise", "makki"].includes(normalized)) {
    return "Mecquoise";
  }

  if (["medinan", "madinah", "medinoise", "médinoise", "madani"].includes(normalized)) {
    return "Médinoise";
  }

  return place || "Non renseigné";
}

export function getPreferredTranslation(
  translations?: Translation[] | null,
  preferredLanguage = "fr",
): Translation | null {
  if (!translations?.length) return null;

  return (
    translations.find((translation) => translation.language_code === preferredLanguage) ??
    translations.find((translation) => translation.language_code === "fr") ??
    translations.find((translation) => translation.language_code === "en") ??
    translations[0]
  );
}

export function getResultScore(result: SemanticSearchResult): number | null {
  const score = result.rerank_score ?? result.similarity ?? result.score;
  return typeof score === "number" && Number.isFinite(score) ? score : null;
}

export function formatReference(
  surahNumber: number,
  ayahNumber: number,
  surahName?: string | null,
): string {
  const surah = surahName ? `Sourate ${surahName}` : `Sourate ${surahNumber}`;
  return `${surah}, verset ${ayahNumber}`;
}

export function mapSemanticResult(apiResult: SemanticSearchResult): SemanticSearchResult {
  return {
    ...apiResult,
    text_arabic: cleanText(apiResult.text_arabic),
    ayah: apiResult.ayah ? normalizeAyah(apiResult.ayah) : apiResult.ayah,
    themes: apiResult.themes ?? [],
    reason: apiResult.reason ?? NEUTRAL_REASON,
    similarity: apiResult.similarity ?? apiResult.score,
  };
}

function favoriteId(surahNumber: number, ayahNumber: number) {
  return `ayah:${surahNumber}:${ayahNumber}`;
}

export function resultToFavorite(result: SearchResult | SemanticSearchResult): FavoriteItem {
  const reference = formatReference(
    result.surah_number,
    result.ayah_number,
    result.surah_name_latin,
  );

  return {
    id: favoriteId(result.surah_number, result.ayah_number),
    type: "ayah",
    reference,
    surahNumber: result.surah_number,
    ayahNumber: result.ayah_number,
    arabicText: result.text_arabic,
    translationFr: result.translation,
    createdAt: new Date().toISOString(),
  };
}

export function ayahToFavorite(
  ayah: Ayah,
  translation?: Translation | string | null,
  surah?: Surah | null,
): FavoriteItem {
  const translationText =
    typeof translation === "string" ? translation : translation?.text ?? null;

  return {
    id: favoriteId(ayah.surah_number, ayah.ayah_number),
    type: "ayah",
    reference: formatReference(ayah.surah_number, ayah.ayah_number, surah?.name_latin),
    surahNumber: ayah.surah_number,
    ayahNumber: ayah.ayah_number,
    arabicText: ayah.text_arabic,
    translationFr: translationText,
    createdAt: new Date().toISOString(),
  };
}

export function extractThemesFromQuery(query: string): string[] {
  return detectFrenchThemes(query).themes;
}

export function guidanceResultToFavorite(result: GuidanceResult): FavoriteItem {
  return {
    id: result.id,
    type: "ayah",
    reference: result.reference,
    surahNumber: result.surahNumber,
    ayahNumber: result.ayahNumber,
    arabicText: result.arabicText,
    translationFr: result.translationFr,
    createdAt: new Date().toISOString(),
  };
}

export function mapSemanticApiResultToGuidanceResult(
  apiResult: SemanticSearchResult,
  queryContext: GuidanceQueryAnalysis,
): GuidanceResult {
  const result = mapSemanticResult(apiResult);
  const themes = result.themes?.length ? result.themes : queryContext.themes;
  const surahName = result.surah_name_latin ?? undefined;
  const reference = formatReference(result.surah_number, result.ayah_number, surahName);
  const score = getResultScore(result) ?? undefined;

  return {
    id: favoriteId(result.surah_number, result.ayah_number),
    type: "ayah",
    reference,
    surahNumber: result.surah_number,
    ayahNumber: result.ayah_number,
    surahName,
    arabicText: result.text_arabic,
    translationFr: result.translation ?? getPreferredTranslation(result.ayah?.translations)?.text ?? null,
    score,
    reason: result.reason?.trim() || getReasonForThemes(themes),
    themes,
    needsContext: false,
  };
}

export function mapSemanticResponseToGuidanceResponse(
  response: SemanticSearchResponse,
  query: string,
): GuidanceSearchResponse {
  const detected = detectFrenchThemes(query);
  const results = response.results.map((result) =>
    mapSemanticApiResultToGuidanceResult(result, detected),
  );

  return {
    query,
    detected,
    results,
    exploreMore: getExploreMoreQueries(detected.themes),
    suggestedQueries: getSuggestedReformulations(detected.themes),
    provider: response.provider,
    total: response.total ?? results.length,
  };
}

export function buildSearchParams(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}
