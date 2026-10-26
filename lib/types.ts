export type Category = "claude-code" | "mcp" | "skills" | "agents" | "guides";

export type Tool = {
  id: string;
  name: string;
  repo: string; // "owner/name"
  description: string;
  category: Category;
  tags: string[];
  stars: number;
  starHistory: number[]; // 하루 1개씩 쌓인 스타 수, 오래된 순
  lastCommit: string; // ISO 날짜
  archived: boolean;
};

export type Swap = {
  id: string;
  category: Category;
  from: { name: string; detail: string; status: "archived" | "working" };
  to: { name: string; detail: string };
  reason: string;
  effort: string;
  match: string[]; // 설정 파일에서 기존 도구를 알아보는 키워드 (패키지명 등)
};

// gainDays: starGain을 계산한 기간. 기록이 7일보다 짧으면 그만큼만.
export type RankedTool = Tool & { freshness: number; starGain: number; gainDays: number };
