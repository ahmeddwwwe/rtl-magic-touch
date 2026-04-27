import { useEffect, useMemo, useRef, useState } from "react";
import { X, Check, Sparkles } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";

type Highlight = TranslationKey;

export type ServiceDetail = {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  tagKey: TranslationKey;
  statKey: TranslationKey;
  img: string;
  accent: string; // gradient classes used by the card
  glowColor: string; // CSS color for halo (e.g. "hsl(var(--ice))")
  highlights: Highlight[];
  durationKey: TranslationKey;
  groupKey: TranslationKey;
  levelKey: TranslationKey;
};

type Props = {
  service: ServiceDetail | null;
  onClose: () => void;
  onBook: () => void;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotate: number;
  duration: number;
  delay: number;
};

const PARTICLE_COUNT = 28;

const buildParticles = (): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.4;
    const distance = 180 + Math.random() * 220;
    return {
      id: i,
      x: 50,
      y: 50,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size: 4 + Math.random() * 10,
      rotate: Math.random() * 720 - 360,
      duration: 900 + Math.random() * 700,
      delay: Math.random() * 120,
    };
  });

export const ServiceModal = ({ service, onClose, onBook }: Props) => {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const particles = useMemo(buildParticles, [service?.titleKey]);

  useEffect(() => {
    if (!service) {
      setMounted(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(id);
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(service.titleKey)}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-night/85 backdrop-blur-md transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      />

      {/* Particle burst */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute top-1/2 start-1/2 rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: service.glowColor,
              boxShadow: `0 0 ${p.size * 2}px ${service.glowColor}`,
              transform: "translate(-50%, -50%)",
              animation: `service-burst ${p.duration}ms ease-out ${p.delay}ms forwards`,
              ["--burst-x" as string]: `${p.dx}px`,
              ["--burst-y" as string]: `${p.dy}px`,
              ["--burst-rot" as string]: `${p.rotate}deg`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={`relative w-full max-w-3xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-deep shadow-2xl transition-all duration-500 ${
          mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6"
        }`}
        style={{
          boxShadow: `0 30px 80px -20px ${service.glowColor}, 0 0 60px -10px ${service.glowColor}`,
        }}
      >
        {/* Hero image with Ken Burns */}
        <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden">
          <img
            src={service.img}
            alt={t(service.titleKey)}
            className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/30 to-transparent" />
          <div
            className={`absolute inset-0 bg-gradient-to-tr ${service.accent} mix-blend-overlay opacity-70`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer-once" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 end-3 grid h-10 w-10 place-items-center rounded-full bg-night/70 backdrop-blur border border-white/15 text-frost hover:bg-night hover:scale-110 transition-spring"
            aria-label={t("modal.close")}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Tag badge */}
          <div className="absolute top-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-night/70 backdrop-blur border border-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-frost">
            <Sparkles className="h-3 w-3 text-gold" />
            {t(service.tagKey)}
          </div>

          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-frost leading-tight drop-shadow-lg">
              {t(service.titleKey)}
            </h2>
            <div className="mt-2 inline-block rounded-full bg-gold/90 text-night px-3 py-1 text-xs font-black tracking-wider">
              {t(service.statKey)}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 space-y-6">
          <p className="text-base sm:text-lg text-frost/85 leading-relaxed">
            {t(service.descKey)}
          </p>

          {/* Quick info chips */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { labelKey: "modal.duration" as TranslationKey, value: service.durationKey },
              { labelKey: "modal.group" as TranslationKey, value: service.groupKey },
              { labelKey: "modal.level" as TranslationKey, value: service.levelKey },
            ].map((c) => (
              <div
                key={c.labelKey}
                className="rounded-2xl border border-white/10 bg-night/40 p-3 text-center"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t(c.labelKey)}
                </div>
                <div className="mt-1 text-sm font-black text-frost">{t(c.value)}</div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-ice mb-3">
              {t("modal.includes")}
            </h3>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {service.highlights.map((h, i) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-night/30 p-3 transition-colors hover:bg-night/50"
                  style={{ animation: `fade-up 0.5s ease-out ${0.15 + i * 0.06}s both` }}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ice/20 text-ice mt-0.5">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-frost/90 font-medium">{t(h)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              onClose();
              window.setTimeout(onBook, 320);
            }}
            className="relative w-full overflow-hidden rounded-2xl bg-gradient-gold text-night font-black text-base sm:text-lg py-4 transition-spring hover:-translate-y-0.5 shadow-lift"
          >
            <span className="relative z-10">🎿 {t("modal.bookCta")}</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
