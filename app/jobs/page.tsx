"use client";

import { useEffect, useState } from "react";
import { api, IndexingJob } from "@/lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState<IndexingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobType, setJobType] = useState("quran_text_seed");

  const load = () => {
    api.getJobs().then(setJobs).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const createJob = async () => {
    try {
      await api.createJob({ job_type: jobType });
      load();
    } catch (e: unknown) {
      alert("Erreur : " + (e instanceof Error ? e.message : "inconnue"));
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: "badge-success",
      failed: "badge-error",
      running: "badge-warning",
      pending: "badge-info",
      cancelled: "badge-info",
    };
    return map[status] || "badge-info";
  };

  return (
    <div className="container">
      <h1>Tâches d’indexation</h1>

      <div className="card">
        <div className="form-row">
          <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="quran_text_seed">quran_text_seed</option>
            <option value="text_embedding">text_embedding</option>
            <option value="translation_embedding">translation_embedding</option>
            <option value="audio_metadata_import">audio_metadata_import</option>
          </select>
          <button onClick={createJob} style={{ maxWidth: "150px" }}>
            Créer la tâche
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Chargement...</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted">Aucune tâche pour le moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Créée le</th>
              <th>Résultat / erreur</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>{j.id}</td>
                <td className="text-sm">{j.job_type}</td>
                <td>
                  <span className={`badge ${statusBadge(j.status)}`}>{j.status}</span>
                </td>
                <td className="text-sm text-muted">
                  {new Date(j.created_at).toLocaleString()}
                </td>
                <td className="text-sm">
                  {j.error_message ? (
                    <span style={{ color: "var(--error)" }}>{j.error_message}</span>
                  ) : j.result ? (
                    <span className="text-muted">{JSON.stringify(j.result).slice(0, 80)}</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
