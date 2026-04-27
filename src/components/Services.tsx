import { useRef, useState } from "react";
import { Snowflake, Trees, Package, Waves, Sparkles, Flame, ArrowUpLeft } from "lucide-react";
import skiing from "@/assets/service-skiing.jpg";
import freestyle from "@/assets/service-freestyle.jpg";
import icemaze from "@/assets/service-icemaze.jpg";
import rental from "@/assets/service-rental.jpg";
import spa from "@/assets/service-spa.jpg";
import bonfire from "@/assets/service-bonfire.jpg";
import { useT } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
import { useTilt } from "@/hooks/useTilt";
import { ServiceModal, type ServiceDetail } from "./ServiceModal";

type Svc = ServiceDetail & {
  icon: typeof Snowflake;
};

const services: Svc[] = [
  { icon: Snowflake, titleKey: "svc.skiing.title", descKey: "svc.skiing.desc", tagKey: "svc.skiing.tag", statKey: "svc.skiing.stat", img: skiing, accent: "from-ice/40 via-ice/10 to-transparent", glowColor: "hsl(var(--ice))", durationKey: "svc.skiing.dur", groupKey: "svc.skiing.grp", levelKey: "svc.skiing.lvl", highlights: ["svc.skiing.h1", "svc.skiing.h2", "svc.skiing.h3", "svc.skiing.h4"] },
  { icon: Trees, titleKey: "svc.freestyle.title", descKey: "svc.freestyle.desc", tagKey: "svc.freestyle.tag", statKey: "svc.freestyle.stat", img: freestyle, accent: "from-gold/40 via-gold/10 to-transparent", glowColor: "hsl(var(--gold))", durationKey: "svc.freestyle.dur", groupKey: "svc.freestyle.grp", levelKey: "svc.freestyle.lvl", highlights: ["svc.freestyle.h1", "svc.freestyle.h2", "svc.freestyle.h3", "svc.freestyle.h4"] },
  { icon: Sparkles, titleKey: "svc.icemaze.title", descKey: "svc.icemaze.desc", tagKey: "svc.icemaze.tag", statKey: "svc.icemaze.stat", img: icemaze, accent: "from-purple-500/40 via-ice/10 to-transparent", glowColor: "hsl(270 80% 70%)", durationKey: "svc.icemaze.dur", groupKey: "svc.icemaze.grp", levelKey: "svc.icemaze.lvl", highlights: ["svc.icemaze.h1", "svc.icemaze.h2", "svc.icemaze.h3", "svc.icemaze.h4"] },
  { icon: Package, titleKey: "svc.rental.title", descKey: "svc.rental.desc", tagKey: "svc.rental.tag", statKey: "svc.rental.stat", img: rental, accent: "from-amber-500/40 via-gold/10 to-transparent", glowColor: "hsl(38 95% 60%)", durationKey: "svc.rental.dur", groupKey: "svc.rental.grp", levelKey: "svc.rental.lvl", highlights: ["svc.rental.h1", "svc.rental.h2", "svc.rental.h3", "svc.rental.h4"] },
  { icon: Waves, titleKey: "svc.spa.title", descKey: "svc.spa.desc", tagKey: "svc.spa.tag", statKey: "svc.spa.stat", img: spa, accent: "from-rose-400/40 via-ice/10 to-transparent", glowColor: "hsl(350 85% 70%)", durationKey: "svc.spa.dur", groupKey: "svc.spa.grp", levelKey: "svc.spa.lvl", highlights: ["svc.spa.h1", "svc.spa.h2", "svc.spa.h3", "svc.spa.h4"] },
  { icon: Flame, titleKey: "svc.bonfire.title", descKey: "svc.bonfire.desc", tagKey: "svc.bonfire.tag", statKey: "svc.bonfire.stat", img: bonfire, accent: "from-orange-500/50 via-red-500/15 to-transparent", glowColor: "hsl(20 95% 60%)", durationKey: "svc.bonfire.dur", groupKey: "svc.bonfire.grp", levelKey: "svc.bonfire.lvl", highlights: ["svc.bonfire.h1", "svc.bonfire.h2", "svc.bonfire.h3", "svc.bonfire.h4"] },
];

const ServiceCard = ({ s, i, t, onOpen }: { s: Svc; i: number; t: ReturnType<typeof useT>; onOpen: () => void }) => {
  const ref = useRef<HTMLElement>(null);
  useTilt(ref as React.RefObject<HTMLElement>, 7);
  return (
    <article
      ref={ref as never}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="reveal group relative overflow-hidden rounded-3xl border border-border/60 bg-card transition-spring hover:border-ice/40 hover:shadow-ice cursor-pointer aspect-[4/5]"
      style={{ ["--reveal-delay" as string]: `${i * 0.08}s`, transformStyle: "preserve-3d" } as React.CSSProperties}
    >
      <img
        src={s.img}
        alt={t(s.titleKey)}
        loading="lazy"
        width={1024}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-[1200ms] ease-out group-hover:scale-110 group-hover:saturate-150"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/10" />
      <div className={`absolute inset-0 bg-gradient-to-tr ${s.accent} opacity-0 transition-smooth group-hover:opacity-100 mix-blend-overlay`} />
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-full" />

      <div className="absolute top-4 end-4 z-10" style={{ transform: "translateZ(40px)" }}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-night/70 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-frost">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-soft" />
          {t(s.tagKey)}
        </span>
      </div>

      <div className="absolute top-4 start-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-night/60 backdrop-blur-md border border-white/10 text-frost transition-spring group-hover:bg-gold group-hover:text-night group-hover:rotate-45" style={{ transform: "translateZ(40px)" }}>
        <ArrowUpLeft className="h-4 w-4" strokeWidth={2.5} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-ice shadow-ice transition-spring group-hover:scale-110 group-hover:rotate-[-8deg]">
            <s.icon className="h-6 w-6 text-night" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-gold tracking-wider">{t(s.statKey)}</span>
        </div>
        <h3 className="text-2xl font-black text-frost mb-2 leading-tight">{t(s.titleKey)}</h3>
        <p className="text-sm text-frost/70 leading-relaxed line-clamp-2 transition-smooth group-hover:text-frost/90">
          {t(s.descKey)}
        </p>
        <div className="mt-4 h-0.5 w-12 bg-gradient-gold transition-all duration-500 group-hover:w-full" />
      </div>
    </article>
  );
};

type ServicesProps = { onBook?: () => void };

export const Services = ({ onBook }: ServicesProps = {}) => {
  const t = useT();
  const [active, setActive] = useState<Svc | null>(null);
  return (
    <section id="services" className="relative py-24 md:py-32 bg-deep/50 overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-ice/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />

      <div className="container relative">
        <div className="reveal text-center mb-16">
          <span className="inline-block rounded-full border border-border/60 bg-gold/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            {t("services.tag")}
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black">
            {t("services.title.l1")} <span className="text-gradient-aurora">{t("services.title.l2")}</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.titleKey} s={s} i={i} t={t} onOpen={() => setActive(s)} />
          ))}
        </div>
      </div>

      <ServiceModal
        service={active}
        onClose={() => setActive(null)}
        onBook={() => onBook?.()}
      />
    </section>
  );
};

