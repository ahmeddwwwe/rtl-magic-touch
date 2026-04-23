import { MapPin, ExternalLink } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Interactive embedded map for Saint Catherine — uses OpenStreetMap (no API key).
 */
export const LocationMap = () => {
  const t = useT();
  // Saint Catherine area, South Sinai — bounding box around 33.93,28.55
  const src =
    "https://www.openstreetmap.org/export/embed.html?bbox=33.85%2C28.50%2C34.05%2C28.62&layer=mapnik&marker=28.5604%2C33.9485";

  return (
    <div className="reveal mt-12 max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-card shadow-soft">
        <div className="absolute top-4 start-4 z-10 inline-flex items-center gap-2 rounded-full bg-night/80 backdrop-blur-md border border-gold/30 px-4 py-2 text-xs font-bold text-gold shadow-gold">
          <MapPin className="h-3.5 w-3.5" />
          {t("contact.location.value")}
        </div>
        <a
          href="https://www.openstreetmap.org/?mlat=28.5604&mlon=33.9485#map=12/28.5604/33.9485"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 end-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-ice text-night text-xs font-black px-4 py-2 shadow-ice hover:-translate-y-0.5 transition-spring"
        >
          {t("contact.map.open")}
          <ExternalLink className="h-3 w-3" />
        </a>

        <div className="aspect-[16/8] w-full">
          <iframe
            title={t("contact.map.title")}
            src={src}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, filter: "saturate(0.8) hue-rotate(-10deg) contrast(1.05)" }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/40 via-transparent to-transparent mix-blend-multiply" />
      </div>
    </div>
  );
};
