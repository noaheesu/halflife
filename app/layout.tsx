import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["700", "800"] });
const body = IBM_Plex_Sans_KR({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Halflife",
  description: "Claude Code, MCP, 에이전트 도구를 모아서 낡은 도구는 무엇으로 바꾸면 되는지 알려줍니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
