"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { FormEvent, useState } from "react";

type SearchBarProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
  loading?: boolean;
};

export function SearchBar({
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  placeholder = "Décris une situation, une émotion ou un thème...",
  compact = false,
  loading = false,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const updateValue = (next: string) => {
    setInternalValue(next);
    onChange?.(next);
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = currentValue.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <form
      className={`search-shell ${compact ? "search-shell-compact" : ""}`}
      onSubmit={submit}
    >
      <Search className="search-icon" aria-hidden="true" />
      <input
        value={currentValue}
        onChange={(event) => updateValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Recherche"
      />
      {currentValue && (
        <button
          type="button"
          className="clear-button"
          aria-label="Effacer la recherche"
          onClick={() => updateValue("")}
        >
          <X aria-hidden="true" />
        </button>
      )}
      {!compact && (
        <button type="submit" className="search-submit" disabled={loading || !currentValue.trim()}>
          {loading ? <span className="loading-dots" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          <span className="sr-only">Rechercher</span>
        </button>
      )}
    </form>
  );
}
