import assert from "node:assert/strict";
import { test } from "node:test";
import { checkStack, parseStack } from "./stack.ts";
import type { RankedTool, Swap } from "./types.ts";

const tool = (repo: string, extra: Partial<RankedTool> = {}): RankedTool => ({
  id: repo, name: repo, repo, description: "", category: "mcp", tags: [], stars: 0, starHistory: [],
  lastCommit: "2026-10-01", archived: false, freshness: 90, starGain: 0, gainDays: 0, ...extra,
});
const tools = [
  tool("microsoft/playwright-mcp"),
  tool("upstash/context7", { freshness: 10 }),
  tool("someone/old-server", { archived: true, freshness: 0 }),
  tool("n8n-io/n8n"),
];
const swaps: Swap[] = [{
  id: "p", category: "mcp", match: ["server-puppeteer"], reason: "", effort: "",
  from: { name: "Puppeteer MCP", detail: "", status: "archived" }, to: { name: "Playwright MCP", detail: "" },
}];

const config = JSON.stringify({
  mcpServers: {
    browser: { command: "npx", args: ["-y", "@modelcontextprotocol/server-puppeteer"] },
    pw: { command: "npx", args: ["@playwright/mcp@latest"] },
    docs: { type: "http", url: "https://mcp.context7.com/mcp", env: { KEY: "secret-old-server" } },
  },
  projects: { "/work": { mcpServers: { legacy: { command: "old-server" }, mine: { command: "./my-tool" } } } },
  enabledPlugins: { "commit-helper@market": true, "off@market": false },
});

test("중첩된 mcpServers와 켜진 플러그인만 모은다", () => {
  assert.deepEqual(parseStack(config).map((e) => e.name), ["browser", "pw", "docs", "legacy", "mine", "commit-helper@market"]);
});

test("교체 추천, 관리 중단, 오래됨, 최신, 모름을 구분한다", () => {
  const r = checkStack(parseStack(config), tools, swaps);
  assert.deepEqual(r.map((x) => [x.name, x.status]), [
    ["browser", "swap"], ["pw", "fresh"], ["docs", "stale"], ["legacy", "archived"], ["mine", "unknown"], ["commit-helper@market", "unknown"],
  ]);
});

test("env 값과 짧은 리포 이름으로는 매칭하지 않는다", () => {
  const r = checkStack(parseStack(JSON.stringify({ mcpServers: { x: { command: "n8n", env: { A: "old-server" } } } })), tools, swaps);
  assert.equal(r[0].status, "unknown");
});

test("잘못된 JSON은 throw", () => {
  assert.throws(() => parseStack("{ mcpServers: "));
});
