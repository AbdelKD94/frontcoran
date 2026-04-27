"use client";

type ExploreMoreSectionProps = {
  queries: string[];
  onSelect: (query: string) => void;
};

export function ExploreMoreSection({ queries, onSelect }: ExploreMoreSectionProps) {
  if (queries.length === 0) return null;

  return (
    <section className="guidance-panel">
      <p className="eyebrow">Explorer plus loin</p>
      <div className="chip-row">
        {queries.map((query) => (
          <button
            key={query}
            type="button"
            className="chip chip-suggest"
            onClick={() => onSelect(query)}
          >
            {query}
          </button>
        ))}
      </div>
    </section>
  );
}
