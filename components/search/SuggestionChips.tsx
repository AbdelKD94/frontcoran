"use client";

import { DEFAULT_GUIDANCE_SUGGESTIONS } from "@/lib/guidance";

type SuggestionChipsProps = {
  onSelect: (value: string) => void;
  suggestions?: string[];
};

export function SuggestionChips({
  onSelect,
  suggestions = DEFAULT_GUIDANCE_SUGGESTIONS,
}: SuggestionChipsProps) {
  return (
    <div className="chip-row" aria-label="Suggestions de recherche">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          className="chip chip-suggest"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
