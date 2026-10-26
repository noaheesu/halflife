import type { Category, Tool } from "./types.ts";

const HISTORY_DAYS = 30;

// GitHub REST API의 리포 응답 중 쓰는 필드만
export type Repo = {
  full_name: string;
  name: string;
  description: string | null;
  stargazers_count: number;
  pushed_at: string;
  archived: boolean;
  topics?: string[];
};

// 사람이 고친 필드(이름, 설명, 카테고리, 태그)는 유지하고 수치만 GitHub 값으로 갱신한다.
// sameDay: 직전 크롤링이 오늘이면 기록을 새로 쌓지 않고 마지막 칸을 덮어쓴다 (하루 1칸 유지).
export function applyRepo(prev: Tool | undefined, r: Repo, category: Category, sameDay = false): Tool {
  const history = prev?.starHistory ?? [];
  return {
    id: prev?.id ?? r.full_name.toLowerCase().replace("/", "-"),
    name: prev?.name ?? r.name,
    repo: r.full_name,
    description: prev?.description ?? r.description ?? "",
    descriptionKo: prev?.descriptionKo,
    category: prev?.category ?? category,
    tags: prev?.tags ?? (r.topics ?? []).slice(0, 3),
    stars: r.stargazers_count,
    starHistory: [...(sameDay ? history.slice(0, -1) : history), r.stargazers_count].slice(-HISTORY_DAYS),
    lastCommit: r.pushed_at.slice(0, 10), // 커밋 API를 따로 부르지 않으려고 마지막 push 시각을 쓴다
    archived: r.archived,
  };
}
