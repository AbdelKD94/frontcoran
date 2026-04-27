"use client";

import { Bookmark } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import type { FavoriteItem } from "@/lib/types";

type FavoriteButtonProps = {
  item: FavoriteItem;
  label?: string;
  size?: "sm" | "md";
};

export function FavoriteButton({ item, label, size = "md" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item);

  return (
    <button
      type="button"
      className={`icon-button ${size === "sm" ? "icon-button-sm" : ""} ${active ? "is-active" : ""}`}
      aria-label={active ? "Retirer des favoris" : "Enregistrer"}
      aria-pressed={active}
      title={active ? "Retirer des favoris" : "Enregistrer"}
      onClick={() => toggleFavorite(item)}
    >
      <Bookmark aria-hidden="true" fill={active ? "currentColor" : "none"} />
      {label && <span>{label}</span>}
    </button>
  );
}
