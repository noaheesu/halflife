"use client";

import { useState } from "react";
import { fill, type Dict } from "@/lib/i18n";
import { checkStack, parseStack, type StackResult } from "@/lib/stack";
import type { RankedTool, Swap } from "@/lib/types";

const SAMPLE = `{
  "mcpServers": {
    "puppeteer": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-puppeteer"] },
    "github": { "command": "docker", "args": ["run", "-i", "ghcr.io/github/github-mcp-server"] },
    "context7": { "type": "http", "url": "https://mcp.context7.com/mcp" }
  }
}`;

const TONE: Record<StackResult["status"], string> = {
  swap: "p-stale",
  archived: "p-stale",
  stale: "p-aging",
  fresh: "p-fresh",
  unknown: "p-muted",
};

export default function StackPanel({ tools, swaps, t }: { tools: RankedTool[]; swaps: Swap[]; t: Dict }) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<StackResult[] | null>(null);
  const [error, setError] = useState("");

  function check(text: string) {
    try {
      const entries = parseStack(text);
      setResults(checkStack(entries, tools, swaps));
      setError(entries.length ? "" : t.stack.errNone);
    } catch {
      setResults(null);
      setError(t.stack.errJson);
    }
  }

  const detail = (r: StackResult) => {
    if (r.status === "swap") return `→ ${r.swap.to.name}`;
    if (r.status === "archived" || r.status === "stale") return fill(t.stack.lastPush, { date: r.tool.lastCommit });
    return null;
  };
  const flagged = results?.filter((r) => r.status === "swap" || r.status === "archived" || r.status === "stale").length ?? 0;

  return (
    <div className="card stack">
      <h2>{t.stack.title}</h2>
      <p className="sub">{t.stack.sub}</p>
      <textarea
        id="stack-input"
        className="paste"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t.stack.placeholder}
        aria-label={t.stack.inputLabel}
        spellCheck={false}
      />
      <div className="actions">
        <button className="btn primary" onClick={() => check(input)} disabled={!input.trim()}>
          {t.stack.check}
        </button>
        <button className="btn" onClick={() => { setInput(SAMPLE); check(SAMPLE); }}>
          {t.stack.sample}
        </button>
      </div>
      <p className="privacy">{t.stack.privacy}</p>

      {error && <p className="alert" role="alert">{error}</p>}
      {results && results.length > 0 && (
        <>
          <ul className="results" aria-live="polite">
            {results.map((r) => (
              <li key={r.name}>
                <span className="entry">
                  {r.name}
                  {detail(r) && <small>{detail(r)}</small>}
                </span>
                <span className={`pill ${TONE[r.status]}`}>{t.stack.status[r.status]}</span>
              </li>
            ))}
          </ul>
          <p className={flagged ? "alert" : "ok"}>
            {fill(flagged ? t.stack.flagged : t.stack.allGood, { flagged, total: results.length })}
          </p>
        </>
      )}
    </div>
  );
}
