import { AlertCircle, Loader2, Search } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type StateProps = {
  title: string;
  message?: string;
};

export function LoadingState({ message = "Recherche des passages les plus pertinents..." }) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <Loader2 className="state-icon spin" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export function ErrorState({ title, message }: StateProps) {
  return (
    <div className="state-card state-card-error" role="alert">
      <AlertCircle className="state-icon" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{message ?? `Impossible de contacter le backend QuranLens. Vérifiez que l'API est lancée sur ${API_BASE_URL}.`}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, message }: StateProps) {
  return (
    <div className="state-card">
      <Search className="state-icon" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
