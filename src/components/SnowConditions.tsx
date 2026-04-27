import { useEffect, useState } from "react";
import { Snowflake, Thermometer, Wind, Eye, Mountain, Activity } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";

type Metric = {
  icon: typeof Snowflake;
  labelKey: TranslationKey;
  value: string;
  unitKey?: TranslationKey;
  accent: string;
  trendKey?: TranslationKey;
};

type Slope = {
  nameKey: TranslationKey;
  level: "beginner" | "intermediate" | "advanced";
  status: "open" | "limited";
  crowd: number; // 0-100
};

const metrics: Metric[] = [
  { icon: Snowflake, labelKey: "snow.depth", value: "42", unitKey: "snow.unit.cm", accent: "from-ice to-frost", trendKey: "snow.trend.fresh" },
  { icon: Thermometer, labelKey: "snow.temp", value: "-4", unitKey: "snow.unit.c", accent: "from-aurora to-ice", trendKey: "snow.trend.ideal" },
  { icon: Wind, labelKey: "snow.wind", value: "12", unitKey: "snow.unit.kmh", accent: "from-frost to-aurora", trendKey: "snow.trend.calm" },
  { icon: Eye, labelKey: "snow.visibility", value: "8", unitKey: "snow.unit.km", accent: "from-gold to-ice", trendKey: "snow.trend.clear" },
];

const slopes: Slope[] = [
  { nameKey: "snow.slope.green", level: "beginner", status: "open", crowd: 35 },
  { nameKey: "snow.slope.blue", level: "intermediate", status: "open", crowd: 62 },
  { nameKey: "snow.slope.red", level: "advanced", status: "open", crowd: 28 },
  { nameKey: "snow.slope.black", level: "advanced", status: "limited", crowd: 18 },
];

const levelColors: Record<Slope["level"], string> = {
  beginner: "bg-emerald-400",
  intermediate: "bg-sky-400",
  advanced: "bg-rose-400",
};

export const SnowConditions = () => {
  const t = useT();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="aurora-bg opacity-50" aria-hidden />
      <div className="container relative">
        <div className="reveal text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-ice/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ice">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ice opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ice" />
            </span>
            {t("snow.tag")}
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black">
            {t("snow.title.l1")} <span className="text-gradient-aurora">{t("snow.title.l2")}</span> {t("snow.title.l3")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("snow.updated")} · {time}
          </p>
        </div>

        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.labelKey}
                className="group relative glass-strong rounded-2xl p-5 md:p-6 overflow-hidden transition-spring hover:-translate-y-1 hover:shadow-ice"
              >
                <div className={`absolute -top-10 -end-10 h-28 w-28 rounded-full bg-gradient-to-br ${m.accent} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
                <Icon className="h-6 w-6 md:h-7 md:w-7 text-ice mb-3" />
                <div className="text-3xl md:text-4xl font-black text-frost tabular-nums">
                  {m.value}
                  {m.unitKey && (
                    <span className="text-base md:text-lg font-bold text-muted-foreground ms-1">{t(m.unitKey)}</span>
                  )}
                </div>
                <div className="mt-1 text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {t(m.labelKey)}
                </div>
                {m.trendKey && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-ice/90 bg-ice/10 rounded-full px-2 py-1">
                    <Activity className="h-3 w-3" />
                    {t(m.trendKey)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="reveal glass-strong rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <Mountain className="h-5 w-5 text-gold" />
            <h3 className="text-lg md:text-xl font-black text-frost">{t("snow.slopes.title")}</h3>
          </div>
          <div className="grid gap-3">
            {slopes.map((s) => (
              <div
                key={s.nameKey}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-border/40 bg-night/30 transition-colors hover:bg-night/50"
              >
                <span className={`h-3 w-3 rounded-full ${levelColors[s.level]} shrink-0`} aria-hidden />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-frost text-sm md:text-base">{t(s.nameKey)}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${
                        s.status === "open"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {t(s.status === "open" ? "snow.status.open" : "snow.status.limited")}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-border/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ice to-aurora transition-[width] duration-700"
                      style={{ width: `${s.crowd}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs font-bold text-muted-foreground tabular-nums shrink-0 w-10 text-end">
                  {s.crowd}%
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground text-center">{t("snow.legend")}</p>
        </div>
      </div>
    </section>
  );
};
