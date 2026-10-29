// 매일 실행: 추적 중인 리포를 갱신하고, 토픽 검색으로 새 리포를 찾아 data/tools.json에 쓴다.
// 실행: GITHUB_TOKEN=... node scripts/crawl.ts
import { readFile, writeFile } from "node:fs/promises";
import { applyRepo, isRelevant, type Repo } from "../lib/merge.ts";
import type { Category, Tool } from "../lib/types.ts";

const FILE = new URL("../data/tools.json", import.meta.url);
const EXCLUDED_FILE = new URL("../data/excluded.json", import.meta.url);
const MIN_STARS = 300;
const ACTIVE_DAYS = 90;
const DISCOVER: { topic: string; category: Category }[] = [
  { topic: "claude-code", category: "claude-code" },
  { topic: "mcp-server", category: "mcp" },
  { topic: "agent-skills", category: "skills" },
  { topic: "claude-agent-sdk", category: "agents" },
];

async function gh<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "molt-crawler",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${path}`);
  return res.json() as Promise<T>;
}

const data = JSON.parse(await readFile(FILE, "utf8")) as { updatedAt: string; tools: Tool[] };
const excluded = new Set(
  (JSON.parse(await readFile(EXCLUDED_FILE, "utf8")) as { repo: string }[]).map((e) => e.repo.toLowerCase()),
);
const byRepo = new Map(
  data.tools.filter((t) => !excluded.has(t.repo.toLowerCase())).map((t) => [t.repo.toLowerCase(), t]),
);
const sameDay = data.updatedAt.slice(0, 10) === new Date().toISOString().slice(0, 10);
let updated = 0;

for (const t of [...byRepo.values()]) {
  try {
    const next = applyRepo(t, await gh<Repo>(`/repos/${t.repo}`), t.category, sameDay);
    // 이름이 바뀐 리포는 GitHub이 새 이름으로 돌려준다. 새 키로 옮겨야 검색 결과와 중복되지 않는다.
    byRepo.delete(t.repo.toLowerCase());
    byRepo.set(next.repo.toLowerCase(), next);
    updated++;
  } catch (e) {
    console.warn(`갱신 실패, 이전 값 유지: ${t.repo} (${(e as Error).message})`);
  }
}

const since = new Date(Date.now() - ACTIVE_DAYS * 86_400_000).toISOString().slice(0, 10);
let added = 0;
for (const { topic, category } of DISCOVER) {
  const q = encodeURIComponent(`topic:${topic} stars:>=${MIN_STARS} pushed:>=${since}`);
  try {
    const { items } = await gh<{ items: Repo[] }>(`/search/repositories?q=${q}&sort=stars&per_page=20`);
    for (const r of items) {
      const key = r.full_name.toLowerCase();
      if (byRepo.has(key) || excluded.has(key) || !isRelevant(r, category)) continue;
      byRepo.set(key, applyRepo(undefined, r, category));
      added++;
    }
  } catch (e) {
    console.warn(`검색 실패: ${topic} (${(e as Error).message})`);
  }
}

// 하나도 못 받아왔으면 쓰지 않는다. 낡은 데이터에 새 updatedAt을 찍으면 신선도가 틀어진다.
if (updated + added === 0) {
  console.error("GitHub에서 아무것도 받아오지 못했습니다. 네트워크나 GITHUB_TOKEN을 확인하세요.");
  process.exit(1);
}

const out = { updatedAt: new Date().toISOString(), tools: [...byRepo.values()] };
await writeFile(FILE, JSON.stringify(out, null, 2) + "\n");
console.log(`갱신 ${updated}개, 새로 추가 ${added}개, 총 ${out.tools.length}개`);
