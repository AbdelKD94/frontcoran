"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { getAyahAudios } from "@/lib/api";

type AudioButtonProps = {
  surahNumber: number;
  ayahNumber: number;
  label?: string;
  className?: string;
};

export function AudioButton({
  surahNumber,
  ayahNumber,
  label,
  className = "",
}: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggle = async () => {
    setMessage(null);

    if (audioRef.current && playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      setLoading(true);
      const url =
        audioUrl ??
        (await getAyahAudios(surahNumber, ayahNumber)).find((audio) => audio.audio_url)
          ?.audio_url ??
        null;

      if (!url) {
        setMessage("Audio bientôt disponible.");
        return;
      }

      setAudioUrl(url);
      const audio = audioRef.current ?? new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      await audio.play();
      setPlaying(true);
    } catch {
      setMessage("Audio indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="audio-button-wrap">
      <button
        type="button"
        className={`icon-button ${className}`}
        onClick={toggle}
        aria-label={playing ? "Mettre en pause" : "Écouter"}
        title={message ?? (playing ? "Pause" : "Écouter")}
        disabled={loading}
      >
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        {label && <span>{label}</span>}
      </button>
      {message && (
        <span className="inline-status" role="status">
          {message}
        </span>
      )}
    </span>
  );
}
