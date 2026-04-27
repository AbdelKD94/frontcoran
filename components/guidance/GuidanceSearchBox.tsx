"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { FormEvent, useState } from "react";

type GuidanceSearchBoxProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit: (value: string) => void;
  loading?: boolean;
  compact?: boolean;
  placeholder?: string;
};

export function GuidanceSearchBox({
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  loading = false,
  compact = false,
  placeholder = "Ex. Je traverse une période difficile...",
}: GuidanceSearchBoxProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const updateValue = (next: string) => {
    setInternalValue(next);
    onChange?.(next);
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = currentValue.trim();
    onSubmit(trimmed);
  };

  return (
    <form
      className={`guidance-search-box ${compact ? "guidance-search-box-compact" : ""}`}
      onSubmit={submit}
    >
      <div className="guidance-input-wrap">
        <Search className="search-icon" aria-hidden="true" />
        <input
          value={currentValue}
          onChange={(event) => updateValue(event.target.value)}
          placeholder={placeholder}
          aria-label="Recherche par le sens"
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
      </div>
      <button
        type="submit"
        className="guidance-submit"
        disabled={loading || !currentValue.trim()}
      >
        {loading ? (
          <span className="loading-dots" aria-hidden="true" />
        ) : (
          <ArrowRight aria-hidden="true" />
        )}
        <span>{compact ? "Relancer" : "Explorer par le sens"}</span>
      </button>
    </form>
  );
}
