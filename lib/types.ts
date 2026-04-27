export type HealthResponse = {
  status: string;
  app: string;
};

export type Surah = {
  id?: number;
  number: number;
  name_arabic: string;
  name_latin: string;
  name_translation?: string | null;
  revelation_place?: string | null;
  ayah_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type Translation = {
  id?: number;
  ayah_id?: number;
  language_code: string;
  translator_name?: string | null;
  source_name?: string | null;
  text: string;
  created_at?: string;
  updated_at?: string;
};

export type Ayah = {
  id?: number;
  surah_id?: number;
  surah_number: number;
  ayah_number: number;
  global_ayah_number?: number | null;
  text_arabic: string;
  text_uthmani?: string | null;
  juz?: number | null;
  hizb?: number | null;
  page?: number | null;
  translations?: Translation[];
  created_at?: string;
  updated_at?: string;
};

export type SurahDetail = Surah & {
  ayahs: Ayah[];
};

export type SearchResult = {
  surah_number: number;
  ayah_number: number;
  text_arabic: string;
  translation?: string | null;
  surah_name_latin?: string | null;
};

export type SearchResponse = {
  query: string;
  results: SearchResult[];
  total: number;
};

export type SemanticSearchResult = SearchResult & {
  score?: number;
  similarity?: number;
  rerank_score?: number;
  reason?: string | null;
  themes?: string[];
  source?: string | null;
  content_type?: string | null;
  ayah?: Ayah;
};

export type SemanticSearchResponse = {
  query: string;
  results: SemanticSearchResult[];
  provider?: string;
  total: number;
};

export type GuidanceQueryAnalysis = {
  themes: string[];
  intent: string;
  isSensitive: boolean;
};

export type GuidanceResult = {
  id: string;
  type: "ayah";
  reference: string;
  surahNumber: number;
  ayahNumber: number;
  ayahEndNumber?: number;
  surahName?: string;
  arabicText?: string;
  translationFr?: string | null;
  score?: number;
  reason: string;
  themes: string[];
  needsContext?: boolean;
};

export type GuidanceSearchResponse = {
  query: string;
  detected: GuidanceQueryAnalysis;
  results: GuidanceResult[];
  exploreMore: string[];
  suggestedQueries: string[];
  provider?: string;
  total: number;
};

export type TextIndexResponse = {
  status: string;
  indexed_count: number;
  provider: string;
  model?: string;
  message?: string;
};

export type Reciter = {
  id: number;
  name: string;
  slug: string;
  country?: string | null;
  style?: string | null;
  source_url?: string | null;
};

export type AudioSource = {
  id: number;
  source_type: string;
  title: string;
  url?: string | null;
  license?: string | null;
};

export type AyahAudio = {
  id: number;
  ayah_id: number;
  reciter_id: number;
  audio_source_id?: number | null;
  audio_url?: string | null;
  local_path?: string | null;
  duration_ms?: number | null;
  format?: string | null;
  sample_rate?: number | null;
  has_embedding: boolean;
};

export type IndexingJob = {
  id: number;
  job_type: string;
  status: string;
  source_type?: string | null;
  source_url?: string | null;
  payload?: Record<string, unknown> | null;
  result?: Record<string, unknown> | null;
  error_message?: string | null;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
};

export type FavoriteItem = {
  id: string;
  type: "ayah";
  reference: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText?: string;
  translationFr?: string | null;
  createdAt: string;
};

export type ApiErrorPayload = {
  detail?: string | { msg?: string }[];
  message?: string;
};
