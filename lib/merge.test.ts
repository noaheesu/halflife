import assert from "node:assert/strict";
import { test } from "node:test";
import { applyRepo, isRelevant, type Repo } from "./merge.ts";
import type { Tool } from "./types.ts";

const repo: Repo = {
  full_name: "Owner/Cool-MCP", name: "Cool-MCP", description: "A cool server", stargazers_count: 120,
  pushed_at: "2026-10-20T12:00:00Z", archived: false, topics: ["mcp", "browser", "ai", "extra"],
};

test("새 리포는 GitHub 정보로 채운다", () => {
  const t = applyRepo(undefined, repo, "mcp");
  assert.equal(t.id, "owner-cool-mcp");
  assert.equal(t.description, "A cool server");
  assert.deepEqual(t.tags, ["mcp", "browser", "ai"]);
  assert.deepEqual(t.starHistory, [120]);
  assert.equal(t.lastCommit, "2026-10-20");
});

test("기존 리포는 사람이 쓴 설명을 유지하고 수치만 갱신한다", () => {
  const prev: Tool = { ...applyRepo(undefined, repo, "mcp"), description: "한국어 설명", category: "agents" };
  const t = applyRepo(prev, { ...repo, stargazers_count: 150, archived: true }, "mcp");
  assert.equal(t.description, "한국어 설명");
  assert.equal(t.category, "agents");
  assert.deepEqual(t.starHistory, [120, 150]);
  assert.equal(t.archived, true);
});

test("같은 날 다시 돌리면 마지막 칸을 덮어쓴다", () => {
  const prev: Tool = { ...applyRepo(undefined, repo, "mcp"), starHistory: [100, 110] };
  assert.deepEqual(applyRepo(prev, repo, "mcp", true).starHistory, [100, 120]);
  assert.deepEqual(applyRepo(undefined, repo, "mcp", true).starHistory, [120]);
});

test("스타 기록은 최근 30개만 남긴다", () => {
  const prev: Tool = { ...applyRepo(undefined, repo, "mcp"), starHistory: Array.from({ length: 30 }, (_, i) => i) };
  const t = applyRepo(prev, repo, "mcp");
  assert.equal(t.starHistory.length, 30);
  assert.equal(t.starHistory.at(-1), 120);
  assert.equal(t.starHistory[0], 1);
});

test("MCP 카테고리는 이름이나 설명에 MCP가 있어야 한다", () => {
  const r = (full_name: string, description: string | null): Repo => ({ ...repo, full_name, description });
  assert.equal(isRelevant(r("github/github-mcp-server", "GitHub's official server"), "mcp"), true);
  assert.equal(isRelevant(r("x/tool", "An MCP toolkit"), "mcp"), true);
  assert.equal(isRelevant(r("x/sdk", "SDK for Model Context Protocol servers"), "mcp"), true);
  assert.equal(isRelevant(r("n8n-io/n8n", "Workflow automation platform"), "mcp"), false);
  assert.equal(isRelevant(r("x/mcpherson", "A camera app"), "mcp"), false);
  assert.equal(isRelevant(r("n8n-io/n8n", null), "skills"), true);
});
