import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-gradient-aurora">404</h1>
        <h2 className="mt-4 text-xl font-black text-frost">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير متاحة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-gold px-5 py-2.5 text-sm font-bold text-night shadow-gold transition-spring hover:-translate-y-0.5"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "وادي الراحة | تجربة الثلج الأولى في مصر" },
      { name: "description", content: "وادي الراحة — أول وجهة للرياضات الشتوية والتزلج على الثلج في مصر، على قمم جبال سانت كاترين." },
      { name: "author", content: "Wadi Al-Raha" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "وادي الراحة | تجربة الثلج الأولى في مصر" },
      { property: "og:description", content: "وادي الراحة — أول وجهة للرياضات الشتوية والتزلج على الثلج في مصر، على قمم جبال سانت كاترين." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "وادي الراحة | تجربة الثلج الأولى في مصر" },
      { name: "twitter:description", content: "وادي الراحة — أول وجهة للرياضات الشتوية والتزلج على الثلج في مصر، على قمم جبال سانت كاترين." },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Tajawal:wght@400;700;900&family=Amiri:wght@700&family=Sora:wght@400;600;800&family=Inter:wght@400;500;700;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <HeadContent />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
