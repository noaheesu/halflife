import { freshnessLevel } from "./freshness.ts";
import type { RankedTool, Swap } from "./types.ts";

export type StackEntry = { name: string; text: string };
export type StackResult =
  | { name: string; status: "swap"; swap: Swap }
  | { name: string; status: "archived" | "stale" | "fresh"; tool: RankedTool }
  | { name: string; status: "unknown" };

type ServerConfig = { command?: string; args?: string[]; url?: string };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
// "n8n", "rtk" 같은 짧은 리포 이름이 아무 문자열에나 맞지 않게 하는 최소 길이
const MIN_MATCH = 6;

// .mcp.json, settings.json, ~/.claude.json 어디에 있든 mcpServers와 enabledPlugins를 찾는다. 잘못된 JSON이면 throw.
export function parseStack(input: string): StackEntry[] {
  const found = new Map<string, string>();
  const walk = (v: unknown): void => {
    if (!v || typeof v !== "object") return;
    if (Array.isArray(v)) return v.forEach(walk);
    for (const [key, child] of Object.entries(v)) {
      if (key === "mcpServers" && child && typeof child === "object") {
        // env는 보지 않는다. API 키가 들어 있고 매칭에도 필요 없다.
        for (const [name, cfg] of Object.entries(child as Record<string, ServerConfig>)) {
          const args = Array.isArray(cfg?.args) ? cfg.args.join(" ") : "";
          found.set(name, norm(`${name} ${cfg?.command ?? ""} ${args} ${cfg?.url ?? ""}`));
        }
      } else if (key === "enabledPlugins" && child && typeof child === "object") {
        for (const [name, on] of Object.entries(child)) if (on) found.set(name, norm(name.split("@")[0]));
      } else {
        walk(child);
      }
    }
  };
  walk(JSON.parse(input));
  return [...found].map(([name, text]) => ({ name, text }));
}

export function checkStack(entries: StackEntry[], tools: RankedTool[], swaps: Swap[]): StackResult[] {
  // 긴 이름부터 비교해서 "github-mcp-server"가 "github"보다 먼저 맞게 한다
  const candidates = tools
    .map((tool) => ({ tool, key: norm(tool.repo.split("/")[1] ?? "") }))
    .filter((c) => c.key.length >= MIN_MATCH)
    .sort((a, b) => b.key.length - a.key.length);

  return entries.map(({ name, text }): StackResult => {
    const swap = swaps.find((s) => s.match.some((m) => text.includes(norm(m))));
    if (swap) return { name, status: "swap", swap };
    const tool = candidates.find((c) => text.includes(c.key))?.tool;
    if (!tool) return { name, status: "unknown" };
    if (tool.archived) return { name, status: "archived", tool };
    return { name, status: freshnessLevel(tool.freshness) === "stale" ? "stale" : "fresh", tool };
  });
}
