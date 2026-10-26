"use client";

import Link from "next/link";
import { useState } from "react";
import { fill, type Dict, type Lang } from "@/lib/i18n";
import type { Category, RankedTool, Swap } from "@/lib/types";
import Legend from "./Legend";
import StackPanel from "./StackPanel";
import SwapCard from "./SwapCard";
import TrendingRow from "./TrendingRow";

const CATEGORIES = ["all", "claude-code", "mcp", "skills", "agents", "guides"] as const;
const TRENDING_LIMIT = 20;

type Props = { lang: Lang; t: Dict; tools: RankedTool[]; swaps: Swap[]; updatedAt: string };

export default function Feed({ lang, t, tools, swaps, updatedAt }: Props) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const inCategory = (c: Category) => category === "all" || c === category;
  const visibleTools = tools
    .filter(
      (x) =>
        inCategory(x.category) &&
        (!q || `${x.name} ${x.description} ${x.descriptionKo ?? ""} ${x.tags.join(" ")}`.toLowerCase().includes(q)),
    )
    .slice(0, TRENDING_LIMIT);
  const visibleSwaps = swaps.filter(
    (s) =>
      inCategory(s.category) &&
      (!q || `${s.from.name[lang]} ${s.to.name} ${s.reason[lang]}`.toLowerCase().includes(q)),
  );

  return (
    <>
      <header className="header">
        <div className="bar">
          <Link href={lang === "en" ? "/" : "/ko"} className="logo">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
            </svg>
            Halflife
          </Link>
          <label className="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
            />
          </label>
          <nav className="langs" aria-label="Language">
            <Link href="/" aria-current={lang === "en" ? "page" : undefined}>EN</Link>
            <Link href="/ko" aria-current={lang === "ko" ? "page" : undefined}>한국어</Link>
          </nav>
        </div>
      </header>

      <div className="wrap">
        <section className="hero">
          <div className="hero-text">
            <h1>{t.heroTitle}</h1>
            <p className="lead">{t.heroLead}</p>
            <p className="meta">
              <span>{t.updated} <b>{updatedAt.slice(0, 10)}</b></span>
              <span>{fill(t.tracked, { n: tools.length })}</span>
              <span>{fill(t.swapCount, { n: swaps.length })}</span>
            </p>
          </div>
          <ol className="steps">
            {t.steps.map((s, i) => (
              <li key={s.title}>
                <span className="step-n">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{fill(s.body, { n: tools.length })}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="chips" role="group" aria-label={t.categoryLabel}>
          {CATEGORIES.map((c) => (
            <button key={c} className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {t.categories[c]}
            </button>
          ))}
        </div>

        <div className="grid">
          <main>
            <section>
              <h2>{t.swapsTitle}</h2>
              <p className="sub">{t.swapsSub}</p>
              {visibleSwaps.length ? (
                <div className="swaps">{visibleSwaps.map((s) => <SwapCard key={s.id} swap={s} lang={lang} t={t} />)}</div>
              ) : (
                <p className="empty">{t.swapsEmpty}</p>
              )}
            </section>

            <section>
              <h2>{t.trendingTitle}</h2>
              <p className="sub">{t.trendingSub}</p>
              <Legend t={t} />
              {visibleTools.length ? (
                <ol className="list">
                  {visibleTools.map((x, i) => <TrendingRow key={x.id} tool={x} rank={i + 1} lang={lang} t={t} />)}
                </ol>
              ) : (
                <p className="empty">{t.trendingEmpty}</p>
              )}
            </section>
          </main>

          <aside>
            <StackPanel tools={tools} swaps={swaps} t={t} />
          </aside>
        </div>
      </div>
    </>
  );
}
