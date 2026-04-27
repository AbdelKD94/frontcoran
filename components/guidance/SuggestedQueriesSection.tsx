"use client";

type SuggestedQueriesSectionProps = {
  queries: string[];
  onSelect: (query: string) => void;
};

export function SuggestedQueriesSection({ queries, onSelect }: SuggestedQueriesSectionProps) {
  if (queries.length === 0) return null;

  return (
    <section className="guidance-panel">
      <p className="eyebrow">Reformuler</p>
      <h2>Tu peux aussi essayer :</h2>
      <div className="suggested-query-list">
        {queries.map((query) => (
          <button key={query} type="button" onClick={() => onSelect(query)}>
            {query}
          </button>
        ))}
      </div>
    </section>
  );
}
