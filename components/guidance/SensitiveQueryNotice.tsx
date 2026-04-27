import { HeartHandshake } from "lucide-react";

export function SensitiveQueryNotice() {
  return (
    <aside className="guidance-notice guidance-notice-sensitive" role="status">
      <HeartHandshake aria-hidden="true" />
      <p>
        Je suis désolé que tu traverses cela. QuranLens peut te proposer des passages
        d’apaisement, mais si tu es en danger immédiat ou si tu penses te faire du mal,
        contacte immédiatement les urgences ou une personne de confiance.
      </p>
    </aside>
  );
}
