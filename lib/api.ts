import {
  buildSearchParams,
  mapSemanticResponseToGuidanceResponse,
  mapSemanticResult,
  normalizeAyah,
  normalizeSurah,
  normalizeSurahDetail,
} from "@/lib/mappers";
import type {
  ApiErrorPayload,
  AudioSource,
  Ayah,
  AyahAudio,
  GuidanceSearchResponse,
  HealthResponse,
  IndexingJob,
  Reciter,
  SearchResponse,
  SemanticSearchResponse,
  Surah,
  SurahDetail,
  TextIndexResponse,
  Translation,
} from "@/lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8010";

function extractErrorMessage(payload: ApiErrorPayload | null, fallback: string) {
  if (!payload) return fallback;

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  if (Array.isArray(payload.detail) && payload.detail[0]?.msg) {
    return payload.detail[0].msg;
  }

  return payload.message ?? fallback;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    throw new Error(
      extractErrorMessage(
        payload,
        `Impossible de contacter le backend QuranLens sur ${API_BASE_URL}.`,
      ),
    );
  }

  return response.json() as Promise<T>;
}

export function getHealth() {
  return apiFetch<HealthResponse>("/health");
}

export async function getSurahs() {
  const surahs = await apiFetch<Surah[]>("/api/quran/surahs");
  return surahs.map(normalizeSurah);
}

export async function getSurah(number: number, includeAyahs = true) {
  const surah = await apiFetch<SurahDetail>(
    `/api/quran/surahs/${number}?include_ayahs=${includeAyahs}`,
  );
  return includeAyahs ? normalizeSurahDetail(surah) : normalizeSurah(surah);
}

export function getAyah(surahNumber: number, ayahNumber: number) {
  return apiFetch<Ayah>(`/api/quran/ayahs/${surahNumber}/${ayahNumber}`).then(normalizeAyah);
}

export function getTranslations(
  surahNumber: number,
  ayahNumber: number,
  language?: string,
) {
  const query = buildSearchParams({ language });
  return apiFetch<Translation[]>(
    `/api/quran/ayahs/${surahNumber}/${ayahNumber}/translations${query ? `?${query}` : ""}`,
  );
}

export function searchQuranText(query: string, language?: string, limit = 20) {
  const params = buildSearchParams({ q: query, language, limit });
  return apiFetch<SearchResponse>(`/api/quran/search?${params}`).then((response) => ({
    ...response,
    results: response.results.map((result) => ({
      ...result,
      text_arabic: result.text_arabic.replace(/^\uFEFF/, ""),
    })),
  }));
}

export async function semanticSearch(
  query: string,
  options: { language?: string; languageCode?: string; limit?: number } = {},
) {
  const response = await apiFetch<SemanticSearchResponse>("/api/embeddings/search/text", {
    method: "POST",
    body: JSON.stringify({
      query,
      language_code: options.language ?? options.languageCode,
      limit: options.limit ?? 10,
    }),
  });

  return {
    ...response,
    results: response.results.map(mapSemanticResult),
  };
}

export async function guidanceSearch(
  query: string,
  options: { language?: string; limit?: number } = {},
): Promise<GuidanceSearchResponse> {
  const response = await semanticSearch(query, {
    language: options.language ?? "fr",
    limit: options.limit ?? 10,
  });

  return mapSemanticResponseToGuidanceResponse(response, query);
}

export function indexText(scope: string, languageCode?: string, forceReindex = false) {
  return apiFetch<TextIndexResponse>("/api/embeddings/index/text", {
    method: "POST",
    body: JSON.stringify({
      scope,
      language_code: languageCode,
      force_reindex: forceReindex,
    }),
  });
}

export function getReciters() {
  return apiFetch<Reciter[]>("/api/audio/reciters");
}

export function createReciter(data: {
  name: string;
  slug: string;
  country?: string;
  style?: string;
}) {
  return apiFetch<Reciter>("/api/audio/reciters", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getAudioSources() {
  return apiFetch<AudioSource[]>("/api/audio/sources");
}

export function createAudioSource(data: {
  source_type: string;
  title: string;
  url?: string;
  license?: string;
}) {
  return apiFetch<AudioSource>("/api/audio/sources", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getAyahAudios(surahNumber?: number, ayahNumber?: number) {
  const params = buildSearchParams({ surah_number: surahNumber, ayah_number: ayahNumber });
  return apiFetch<AyahAudio[]>(`/api/audio/ayah-audios${params ? `?${params}` : ""}`);
}

export function createAyahAudio(data: {
  surah_number: number;
  ayah_number: number;
  reciter_id: number;
  audio_url?: string;
}) {
  return apiFetch<AyahAudio>("/api/audio/ayah-audios", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getJobs() {
  return apiFetch<IndexingJob[]>("/api/indexing/jobs");
}

export function getJob(id: number) {
  return apiFetch<IndexingJob>(`/api/indexing/jobs/${id}`);
}

export function createJob(data: { job_type: string; payload?: Record<string, unknown> }) {
  return apiFetch<IndexingJob>("/api/indexing/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export const api = {
  health: getHealth,
  getSurahs,
  getSurah,
  getAyah,
  getTranslations,
  searchText: searchQuranText,
  searchQuranText,
  semanticSearch: (query: string, languageCode?: string, limit = 10) =>
    semanticSearch(query, { languageCode, limit }),
  guidanceSearch,
  indexText,
  getReciters,
  createReciter,
  getAudioSources,
  createAudioSource,
  getAyahAudios,
  createAyahAudio,
  getJobs,
  getJob,
  createJob,
};

export type {
  AudioSource,
  Ayah,
  AyahAudio,
  GuidanceSearchResponse,
  HealthResponse,
  IndexingJob,
  Reciter,
  SearchResponse,
  SemanticSearchResponse,
  Surah,
  SurahDetail,
  Translation,
};
