"use client";

import { useState } from "react";
import type { Category, RankedTool, Swap } from "@/lib/types";
import StackPanel from "./StackPanel";
import SwapCard from "./SwapCard";
import TrendingRow from "./TrendingRow";

const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "claude-code", label: "Claude Code" },
  { id: "mcp", label: "MCP 서버" },
  { id: "skills", label: "Skills" },
  { id: "agents", label: "에이전트" },
  { id: "guides", label: "사용법·모음" },
];

const TRENDING_LIMIT = 20;

export default function Feed({ tools, swaps, updatedAt }: { tools: RankedTool[]; swaps: Swap[]; updatedAt: string }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const inCategory = (c: Category) => category === "all" || c === category;
  const visibleTools = tools
    .filter((t) => inCategory(t.category) && (!q || `${t.name} ${t.description} ${t.tags.join(" ")}`.toLowerCase().includes(q)))
    .slice(0, TRENDING_LIMIT);
  const visibleSwaps = swaps.filter(
    (s) => inCategory(s.category) && (!q || `${s.from.name} ${s.to.name} ${s.reason}`.toLowerCase().includes(q)),
  );

  return (
    <>
      <header className="header">
        <div className="bar">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
            </svg>
            Halflife
          </div>
          <label className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="'브라우저 자동화'처럼 하고 싶은 일로 검색"
              aria-label="도구 검색"
            />
          </label>
        </div>
      </header>

      <div className="wrap">
        <div className="intro">
          <h1>지난주 플러그인이 벌써 구버전이 됐다면</h1>
          <p>Claude Code, MCP, 에이전트 도구를 매일 모아서 정리하고, 더 나은 게 나오면 무엇으로 바꾸면 되는지까지 알려줍니다.</p>
          <div className="meta">
            <span>업데이트 <b>{updatedAt.slice(0, 10)}</b></span>
            <span>추적 중 <b>{tools.length}</b>개 리포</span>
            <span>교체 추천 <b>{swaps.length}</b>건</span>
          </div>
        </div>

        <div className="chips" role="group" aria-label="카테고리">
          {CATEGORIES.map((c) => (
            <button key={c.id} className="chip" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid">
          <main>
            <section>
              <h2>교체 추천</h2>
              <p className="sub">쓰던 도구보다 나은 대안이 나왔습니다. 이유와 옮기는 방법을 같이 보여줍니다.</p>
              {visibleSwaps.length ? (
                <div className="swaps">{visibleSwaps.map((s) => <SwapCard key={s.id} swap={s} />)}</div>
              ) : (
                <p className="empty">이 조건에 맞는 교체 추천이 아직 없습니다.</p>
              )}
            </section>

            <section>
              <h2>이번 주 급상승</h2>
              <p className="sub">최근 7일 동안 스타가 많이 늘어난 순서입니다. 막대는 마지막 커밋 기준 신선도입니다.</p>
              {visibleTools.length ? (
                <ol className="list">{visibleTools.map((t, i) => <TrendingRow key={t.id} tool={t} rank={i + 1} />)}</ol>
              ) : (
                <p className="empty">검색 결과가 없습니다. 다른 단어로 찾아보세요.</p>
              )}
            </section>
          </main>

          <StackPanel tools={tools} swaps={swaps} />
        </div>
      </div>
    </>
  );
}
