"use client";

import { useState } from "react";
import { checkStack, parseStack, type StackResult } from "@/lib/stack";
import type { RankedTool, Swap } from "@/lib/types";

const SAMPLE = `{
  "mcpServers": {
    "puppeteer": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-puppeteer"] },
    "github": { "command": "docker", "args": ["run", "-i", "ghcr.io/github/github-mcp-server"] },
    "context7": { "type": "http", "url": "https://mcp.context7.com/mcp" }
  }
}`;

const LABEL: Record<StackResult["status"], { text: string; tone: string }> = {
  swap: { text: "교체 추천", tone: "p-stale" },
  archived: { text: "관리 중단", tone: "p-stale" },
  stale: { text: "오래됨", tone: "p-aging" },
  fresh: { text: "최신", tone: "p-fresh" },
  unknown: { text: "정보 없음", tone: "p-muted" },
};

function detail(r: StackResult) {
  if (r.status === "swap") return `→ ${r.swap.to.name}`;
  if (r.status === "archived" || r.status === "stale") return `마지막 활동 ${r.tool.lastCommit}`;
  return null;
}

export default function StackPanel({ tools, swaps }: { tools: RankedTool[]; swaps: Swap[] }) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<StackResult[] | null>(null);
  const [error, setError] = useState("");

  function check(text: string) {
    try {
      const entries = parseStack(text);
      setResults(checkStack(entries, tools, swaps));
      setError(entries.length ? "" : "mcpServers나 enabledPlugins를 찾지 못했습니다. .mcp.json, settings.json, ~/.claude.json 내용을 붙여넣어 주세요.");
    } catch {
      setResults(null);
      setError("JSON 형식이 아닙니다. 파일 내용을 그대로 붙여넣었는지 확인해 주세요.");
    }
  }

  const flagged = results?.filter((r) => r.status === "swap" || r.status === "archived" || r.status === "stale").length ?? 0;

  return (
    <aside>
      <div className="stack">
        <h2>내 스택 점검</h2>
        <p className="sub">.mcp.json, settings.json, ~/.claude.json을 붙여넣으면 낡은 도구를 찾아드립니다. 내용은 브라우저 밖으로 보내지 않습니다.</p>
        <textarea
          id="stack-input"
          className="paste"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{ "mcpServers": { ... } }'
          aria-label="설정 파일 내용"
          spellCheck={false}
        />
        <div className="actions">
          <button className="btn primary" onClick={() => check(input)} disabled={!input.trim()}>
            점검하기
          </button>
          <button className="btn" onClick={() => { setInput(SAMPLE); check(SAMPLE); }}>
            예시로 해보기
          </button>
        </div>

        {error && <p className="alert" role="alert">{error}</p>}
        {results && results.length > 0 && (
          <>
            <ul aria-live="polite">
              {results.map((r) => (
                <li key={r.name}>
                  <span className="entry">
                    {r.name}
                    {detail(r) && <small>{detail(r)}</small>}
                  </span>
                  <span className={`pill ${LABEL[r.status].tone}`}>{LABEL[r.status].text}</span>
                </li>
              ))}
            </ul>
            <p className={flagged ? "alert" : "ok"}>
              {flagged ? `${results.length}개 중 ${flagged}개를 바꾸거나 확인해 보세요.` : `${results.length}개 모두 문제없습니다.`}
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
