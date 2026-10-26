import type { RankedTool, Tool } from "./types";

const HALF_LIFE_DAYS = 30;
const DAY_MS = 86_400_000;
const GAIN_WINDOW_DAYS = 7;

// 마지막 커밋 후 HALF_LIFE_DAYS마다 점수가 절반이 된다. 보관된 리포는 0.
export function freshness(tool: Tool, now: Date): number {
  if (tool.archived) return 0;
  const days = Math.max(0, (now.getTime() - Date.parse(tool.lastCommit)) / DAY_MS);
  return Math.round(100 * 0.5 ** (days / HALF_LIFE_DAYS));
}

export function rank(tools: Tool[], now: Date): RankedTool[] {
  return tools
    .map((t) => {
      const h = t.starHistory;
      const gainDays = Math.min(GAIN_WINDOW_DAYS, Math.max(0, h.length - 1));
      const starGain = gainDays ? h[h.length - 1] - h[h.length - 1 - gainDays] : 0;
      return { ...t, freshness: freshness(t, now), starGain, gainDays };
    })
    .sort((a, b) => b.starGain - a.starGain || b.stars - a.stars);
}

export function freshnessLevel(score: number): "fresh" | "aging" | "stale" {
  return score >= 70 ? "fresh" : score >= 40 ? "aging" : "stale";
}
