"use client";

import { useEffect, useState } from "react";
import { api, Reciter, AudioSource } from "@/lib/api";

export default function AudioPage() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [sources, setSources] = useState<AudioSource[]>([]);
  const [reciterForm, setReciterForm] = useState({ name: "", slug: "", country: "", style: "" });
  const [audioForm, setAudioForm] = useState({ surah_number: "", ayah_number: "", reciter_id: "", audio_url: "" });
  const [message, setMessage] = useState("");

  const load = () => {
    api.getReciters().then(setReciters).catch(() => {});
    api.getAudioSources().then(setSources).catch(() => {});
  };

  useEffect(load, []);

  const addReciter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createReciter({
        name: reciterForm.name,
        slug: reciterForm.slug,
        country: reciterForm.country || undefined,
        style: reciterForm.style || undefined,
      });
      setReciterForm({ name: "", slug: "", country: "", style: "" });
      setMessage("Récitateur créé.");
      load();
    } catch (err: unknown) {
      setMessage("Erreur : " + (err instanceof Error ? err.message : "inconnue"));
    }
  };

  const addAyahAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAyahAudio({
        surah_number: Number(audioForm.surah_number),
        ayah_number: Number(audioForm.ayah_number),
        reciter_id: Number(audioForm.reciter_id),
        audio_url: audioForm.audio_url || undefined,
      });
      setAudioForm({ surah_number: "", ayah_number: "", reciter_id: "", audio_url: "" });
      setMessage("Association audio créée.");
    } catch (err: unknown) {
      setMessage("Erreur : " + (err instanceof Error ? err.message : "inconnue"));
    }
  };

  return (
    <div className="container">
      <h1>Audio</h1>

      {message && (
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      <h2>Récitateurs</h2>
      <div className="card">
        <form onSubmit={addReciter}>
          <div className="form-row">
            <input placeholder="Nom" value={reciterForm.name} onChange={(e) => setReciterForm({ ...reciterForm, name: e.target.value })} required />
            <input placeholder="Slug" value={reciterForm.slug} onChange={(e) => setReciterForm({ ...reciterForm, slug: e.target.value })} required />
            <input placeholder="Pays" value={reciterForm.country} onChange={(e) => setReciterForm({ ...reciterForm, country: e.target.value })} />
            <input placeholder="Style" value={reciterForm.style} onChange={(e) => setReciterForm({ ...reciterForm, style: e.target.value })} />
            <button type="submit" style={{ maxWidth: "100px" }}>Ajouter</button>
          </div>
        </form>
      </div>

      {reciters.length > 0 && (
        <table>
          <thead>
            <tr><th>ID</th><th>Nom</th><th>Slug</th><th>Pays</th><th>Style</th></tr>
          </thead>
          <tbody>
            {reciters.map((r) => (
              <tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.slug}</td><td>{r.country}</td><td>{r.style}</td></tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="mt-2">Associer un audio à un verset</h2>
      <div className="card">
        <form onSubmit={addAyahAudio}>
          <div className="form-row">
            <input type="number" placeholder="N° sourate" value={audioForm.surah_number} onChange={(e) => setAudioForm({ ...audioForm, surah_number: e.target.value })} required />
            <input type="number" placeholder="N° verset" value={audioForm.ayah_number} onChange={(e) => setAudioForm({ ...audioForm, ayah_number: e.target.value })} required />
            <input type="number" placeholder="ID récitateur" value={audioForm.reciter_id} onChange={(e) => setAudioForm({ ...audioForm, reciter_id: e.target.value })} required />
            <input placeholder="Audio URL" value={audioForm.audio_url} onChange={(e) => setAudioForm({ ...audioForm, audio_url: e.target.value })} />
            <button type="submit" style={{ maxWidth: "100px" }}>Ajouter</button>
          </div>
        </form>
      </div>

      <h2 className="mt-2">Sources audio</h2>
      {sources.length > 0 ? (
        <table>
          <thead>
            <tr><th>ID</th><th>Type</th><th>Titre</th><th>Licence</th></tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id}><td>{s.id}</td><td>{s.source_type}</td><td>{s.title}</td><td>{s.license}</td></tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted text-sm">Aucune source audio pour le moment.</p>
      )}
    </div>
  );
}
