import { useEffect, useRef, useState } from "react";
import { Menu, X, Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.webp";
import { useLang, useT, type Lang } from "@/i18n/LanguageProvider";

type Props = { onBook: () => void; onPlay: () => void };

const ScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let pending = false;
    const update = () => {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
      pending = false;
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden />;
};

const linkKeys = [
  { href: "#about", key: "nav.about" as const },
  { href: "#services", key: "nav.services" as const },
  { href: "#pricing", key: "nav.pricing" as const },
  { href: "#offers", key: "nav.offers" as const },
  { href: "#contact", key: "nav.contact" as const },
];

export const Navbar = ({ onBook, onPlay }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const t = useT();
  const { lang, setLang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const langOptions: { code: Lang; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇪🇬" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];
  const currentLang = langOptions.find((l) => l.code === lang) ?? langOptions[0];

  const LangBtn = ({ className = "" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setLangOpen((v) => !v)}
        aria-label={t("lang.aria")}
        aria-expanded={langOpen}
        className="inline-flex items-center gap-1.5 rounded-full border border-frost/20 bg-night/40 backdrop-blur px-3 py-1.5 text-xs font-bold text-frost hover:border-gold/50 hover:text-gold transition-smooth"
      >
        <Languages className="h-3.5 w-3.5" />
        <span>{currentLang.flag}</span>
        <span className="uppercase">{currentLang.code}</span>
      </button>
      {langOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} aria-hidden />
          <ul
            role="listbox"
            className="absolute end-0 mt-2 z-50 w-40 rounded-xl glass-strong border border-frost/20 shadow-soft overflow-hidden"
          >
            {langOptions.map((opt) => (
              <li key={opt.code}>
                <button
                  role="option"
                  aria-selected={lang === opt.code}
                  onClick={() => {
                    setLang(opt.code);
                    setLangOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium transition-smooth ${
                    lang === opt.code
                      ? "bg-gold/15 text-gold"
                      : "text-frost/90 hover:bg-night/60 hover:text-gold"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{opt.flag}</span>
                    <span>{opt.label}</span>
                  </span>
                  {lang === opt.code && <Check className="h-3.5 w-3.5" />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <>
      <ScrollProgress />
      <header className={`fixed inset-x-0 top-0 z-50 nav-slide-down transition-smooth ${scrolled ? "glass-strong py-3 shadow-soft" : "bg-transparent py-5"}`}>
        <nav className="container flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group">
            <span className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-ice/40 shadow-ice transition-spring group-hover:scale-105">
              <img src={logo} alt={t("footer.logoAlt")} width={48} height={48} className="h-full w-full object-cover" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-black text-frost">{t("brand.name")}</span>
              <span className="text-[0.65rem] font-light tracking-wider text-ice-light">{t("brand.tagline")}</span>
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {linkKeys.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="relative text-sm font-medium text-frost/80 transition-colors hover:text-frost after:absolute after:-bottom-1.5 after:right-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full">
                  {t(l.key)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <LangBtn className="hidden sm:inline-flex" />
            <Button onClick={onPlay} className="hidden md:inline-flex bg-gradient-ice text-night font-bold border-0 shadow-ice hover:-translate-y-0.5 hover:shadow-lift transition-spring">
              {t("nav.play")}
            </Button>
            <Button onClick={onBook} className="hidden md:inline-flex bg-gradient-gold text-night font-bold border-0 shadow-gold hover:-translate-y-0.5 hover:shadow-lift transition-spring">
              {t("nav.book")}
            </Button>
            <button onClick={() => setOpen((v) => !v)} className="lg:hidden grid h-10 w-10 place-items-center rounded-xl glass text-frost" aria-label={t("nav.menu")}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div className={`fixed inset-0 z-40 lg:hidden transition-smooth ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-night/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside className={`absolute start-0 top-0 h-full w-[78%] max-w-xs glass-strong p-8 pt-24 transition-spring ${open ? "translate-x-0" : "rtl:translate-x-full ltr:-translate-x-full"}`}>
          <div className="mb-4">
            <LangBtn />
          </div>
          <ul className="flex flex-col gap-1">
            {linkKeys.map((l) => (
              <li key={l.href} className="border-b border-border/40">
                <a href={l.href} onClick={() => setOpen(false)} className="block py-4 text-lg font-medium text-frost/90 hover:text-gold">
                  {t(l.key)}
                </a>
              </li>
            ))}
          </ul>
          <Button onClick={() => { setOpen(false); onPlay(); }} className="mt-8 w-full bg-gradient-ice text-night font-bold shadow-ice">
            {t("nav.playGame")}
          </Button>
          <Button onClick={() => { setOpen(false); onBook(); }} className="mt-3 w-full bg-gradient-gold text-night font-bold shadow-gold">
            {t("nav.book")}
          </Button>
        </aside>
      </div>
    </>
  );
};
