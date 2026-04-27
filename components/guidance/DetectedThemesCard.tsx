import { Sparkles } from "lucide-react";
import type { GuidanceQueryAnalysis } from "@/lib/types";

type DetectedThemesCardProps = {
  detected: GuidanceQueryAnalysis;
};

export function DetectedThemesCard({ detected }: DetectedThemesCardProps) {
  return (
    <section className="guidance-panel" aria-label="Analyse de la recherche">
      <div className="guidance-panel-title">
        <Sparkles aria-hidden="true" />
        <div>
          <p className="eyebrow">Analyse de la recherche</p>
          <h2>Votre recherche semble liée à :</h2>
        </div>
      </div>

      <div className="chip-row">
        {detected.themes.map((theme) => (
          <span key={theme} className="chip chip-theme">
            {theme}
          </span>
        ))}
      </div>

      <p className="guidance-intent">
        Besoin probable : <strong>{detected.intent}</strong>
      </p>
    </section>
  );
}
