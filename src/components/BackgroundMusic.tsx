import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

const AUDIO_SRC = "/audio/ambient.mp3";
const STORAGE_KEY = "wadi-music-muted";

export const BackgroundMusic = () => {
  const t = useT();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = true;
    audio.preload = "auto";
    audioRef.current = audio;

    // Restore user preference
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const initialMuted = stored === null ? true : stored === "1";
    audio.muted = initialMuted;
    setMuted(initialMuted);

    // Attempt autoplay (muted autoplay is allowed by browsers)
    const tryPlay = () => {
      audio.play().then(() => setReady(true)).catch(() => {
        // If even muted autoplay is blocked, start on first user interaction
        const onInteract = () => {
          audio.play().then(() => setReady(true)).catch(() => {});
          window.removeEventListener("pointerdown", onInteract);
          window.removeEventListener("keydown", onInteract);
          window.removeEventListener("touchstart", onInteract);
        };
        window.addEventListener("pointerdown", onInteract, { once: true });
        window.addEventListener("keydown", onInteract, { once: true });
        window.addEventListener("touchstart", onInteract, { once: true });
      });
    };
    tryPlay();

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    // Ensure playback continues after user gesture
    if (audio.paused) audio.play().catch(() => {});
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? t("music.unmute") : t("music.mute")}
      title={muted ? t("music.unmute") : t("music.mute")}
      className="fixed bottom-4 end-4 md:bottom-6 md:end-6 z-40 h-11 w-11 md:h-12 md:w-12 rounded-full glass-strong border border-ice/30 text-frost grid place-items-center hover:bg-night/80 hover:border-gold/50 hover:text-gold transition-spring shadow-ice"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {muted ? (
        <VolumeX className="h-5 w-5" strokeWidth={2.2} />
      ) : (
        <Volume2 className="h-5 w-5 text-gold" strokeWidth={2.2} />
      )}
      {!muted && ready && (
        <span className="absolute inset-0 rounded-full border-2 border-gold/40 animate-ping pointer-events-none" />
      )}
    </button>
  );
};