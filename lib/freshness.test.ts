import assert from "node:assert/strict";
import { test } from "node:test";
import { freshness, rank } from "./freshness.ts";
import type { Tool } from "./types.ts";

const base: Tool = {
  id: "t", name: "t", repo: "o/t", description: "", category: "mcp", tags: [],
  stars: 0, starHistory: [], lastCommit: "2026-10-01", archived: false,
};
const now = new Date("2026-10-01");

test("반감기마다 점수가 절반이 된다", () => {
  assert.equal(freshness(base, now), 100);
  assert.equal(freshness({ ...base, lastCommit: "2026-09-01" }, now), 50);
  assert.equal(freshness({ ...base, lastCommit: "2026-08-02" }, now), 25);
});

test("보관된 리포는 0", () => {
  assert.equal(freshness({ ...base, archived: true }, now), 0);
});

test("최근 7일 스타 증가 순, 같으면 스타 수 순으로 정렬한다", () => {
  const ranked = rank(
    [
      { ...base, id: "slow", starHistory: [10, 12] },
      { ...base, id: "fast", starHistory: [10, 50] },
      { ...base, id: "new-big", stars: 900, starHistory: [900] },
      { ...base, id: "new-small", stars: 5, starHistory: [5] },
    ],
    now,
  );
  assert.deepEqual(
    ranked.map((t) => [t.id, t.starGain, t.gainDays]),
    [["fast", 40, 1], ["slow", 2, 1], ["new-big", 0, 0], ["new-small", 0, 0]],
  );
});

test("기록이 7일보다 길면 7일 전과 비교한다", () => {
  const [t] = rank([{ ...base, starHistory: [0, 100, 101, 102, 103, 104, 105, 107, 110] }], now);
  assert.deepEqual([t.starGain, t.gainDays], [10, 7]);
});
