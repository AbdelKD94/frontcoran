import { AlertCircle, Loader2, Search } from "lucide-react";

type StateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function LoadingGuidanceState({
  message = "Recherche des passages les plus pertinents...",
}: StateProps) {
  const steps = ["Analyse de la demande", "Recherche dans le Coran", "Classement des résultats"];

  return (
    <div className="guidance-loading" role="status" aria-live="polite">
      <Loader2 className="state-icon spin" aria-hidden="true" />
      <div>
        <strong>{message}</strong>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function EmptyGuidanceState({
  title = "Aucun résultat trouvé.",
  message = "Essayez de reformuler votre recherche.",
}: StateProps) {
  return (
    <div className="state-card">
      <Search className="state-icon" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}

export function ErrorGuidanceState({
  title = "Impossible de contacter le backend QuranLens.",
  message = "Vérifiez que l’API est lancée.",
  onRetry,
}: StateProps) {
  return (
    <div className="state-card state-card-error" role="alert">
      <AlertCircle className="state-icon" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
        {onRetry && (
          <button type="button" className="state-action" onClick={onRetry}>
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
