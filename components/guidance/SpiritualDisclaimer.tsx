import { Info } from "lucide-react";

export function SpiritualDisclaimer() {
  return (
    <aside className="guidance-notice guidance-notice-soft">
      <Info aria-hidden="true" />
      <p>
        QuranLens propose une aide à l’exploration des textes. Les résultats ne remplacent
        pas l’avis d’une personne qualifiée.
      </p>
    </aside>
  );
}
