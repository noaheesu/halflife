import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";
import { notFound } from "next/navigation";
import { dict, isLang, LANGS } from "@/lib/i18n";
import "../globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["700", "800"] });
const body = IBM_Plex_Sans_KR({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

// en, ko 두 페이지를 빌드 때 만든다. 그 밖의 경로는 아래 isLang 검사에서 404.
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Molt",
    description: isLang(lang) ? dict[lang].metaDescription : undefined,
    alternates: { languages: { en: "/", ko: "/ko" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
