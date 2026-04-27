"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FavoriteItem } from "@/lib/types";

const STORAGE_KEY = "quranlens:favorites:v1";
const FAVORITES_EVENT = "quranlens:favorites-changed";

type LegacyFavoriteRecord = Partial<FavoriteItem> & {
  surah_number?: number;
  ayah_number?: number;
  label?: string;
  text_arabic?: string;
  translation?: string | null;
  saved_at?: string;
};

function favoriteKey(item: Pick<FavoriteItem, "type" | "surahNumber" | "ayahNumber">) {
  return `${item.type}:${item.surahNumber}:${item.ayahNumber}`;
}

function normalizeFavoriteItem(value: unknown): FavoriteItem | null {
  if (!value || typeof value !== "object") return null;

  const item = value as LegacyFavoriteRecord;
  const surahNumber = item.surahNumber ?? item.surah_number;
  const ayahNumber = item.ayahNumber ?? item.ayah_number;

  if (item.type !== "ayah" || !Number.isFinite(surahNumber) || !Number.isFinite(ayahNumber)) {
    return null;
  }

  return {
    id: item.id ?? `ayah:${surahNumber}:${ayahNumber}`,
    type: "ayah",
    reference: item.reference ?? item.label ?? `Sourate ${surahNumber}, verset ${ayahNumber}`,
    surahNumber: surahNumber as number,
    ayahNumber: ayahNumber as number,
    arabicText: item.arabicText ?? item.text_arabic,
    translationFr: item.translationFr ?? item.translation ?? null,
    createdAt: item.createdAt ?? item.saved_at ?? new Date().toISOString(),
  };
}

function readFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map(normalizeFavoriteItem).filter((item): item is FavoriteItem => Boolean(item))
      : [];
  } catch {
    return [];
  }
}

function writeFavorites(items: FavoriteItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

export function useFavorites() {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readFavorites());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(FAVORITES_EVENT, sync);
    };
  }, []);

  const keys = useMemo(() => new Set(items.map(favoriteKey)), [items]);

  const isFavorite = useCallback(
    (item: Pick<FavoriteItem, "type" | "surahNumber" | "ayahNumber">) =>
      keys.has(favoriteKey(item)),
    [keys],
  );

  const addFavorite = useCallback((item: FavoriteItem) => {
    const current = readFavorites();
    const key = favoriteKey(item);
    const next = [
      { ...item, createdAt: new Date().toISOString() },
      ...current.filter((favorite) => favoriteKey(favorite) !== key),
    ];
    writeFavorites(next);
  }, []);

  const removeFavorite = useCallback(
    (item: Pick<FavoriteItem, "type" | "surahNumber" | "ayahNumber">) => {
      const key = favoriteKey(item);
      writeFavorites(readFavorites().filter((favorite) => favoriteKey(favorite) !== key));
    },
    [],
  );

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      if (isFavorite(item)) {
        removeFavorite(item);
      } else {
        addFavorite(item);
      }
    },
    [addFavorite, isFavorite, removeFavorite],
  );

  return {
    items,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
