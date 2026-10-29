export const LANGS = ["en", "ko"] as const;
export type Lang = (typeof LANGS)[number];
export type Text = Record<Lang, string>;

export const isLang = (s: string): s is Lang => (LANGS as readonly string[]).includes(s);

// "{n} repos" 같은 자리표시자를 채운다. 사전은 서버에서 클라이언트로 넘어가므로 함수 대신 문자열로 둔다.
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

const en = {
  metaDescription: "Claude Code, MCP and agent tools, tracked daily. Find out which ones went stale and what to switch to.",
  searchPlaceholder: "Search by what you want to do, like “browser automation”",
  searchLabel: "Search tools",
  heroTitle: "The plugin you installed last week might already be outdated",
  heroLead:
    "Molt tracks Claude Code plugins, MCP servers, skills and agent tools every day. When a better option shows up, it tells you what to switch to, why, and how much work it is.",
  updated: "Updated",
  tracked: "{n} repos tracked",
  swapCount: "{n} swap suggestions",
  steps: [
    { title: "Track", body: "Every morning we pull stars, last push and archive status for {n} GitHub repos, and discover new ones by topic." },
    { title: "Score", body: "Freshness starts at 100 and halves every 30 days without a push. Archived repos drop to 0." },
    { title: "Swap", body: "When a tool is abandoned or a clearly better one exists, we show the replacement and how hard the move is." },
  ],
  categories: { all: "All", "claude-code": "Claude Code", mcp: "MCP servers", skills: "Skills", agents: "Agents", guides: "Lists & guides" },
  categoryLabel: "Category",
  swapsTitle: "Swap suggestions",
  swapsSub: "Something better than what you may be using. Each card says why and how big the change is.",
  swapsEmpty: "No swap suggestions match this filter yet.",
  oldArchived: "No longer maintained",
  oldWorking: "Still works",
  replaces: "replaced by",
  trendingTitle: "Trending this week",
  trendingSub: "Sorted by stars gained over the last 7 days. Ties fall back to total stars.",
  trendingEmpty: "No results. Try a different word.",
  collecting: "Collecting history",
  gain: "+{n} in {d}d",
  pushed: "Pushed {when}",
  stack: {
    title: "Check your stack",
    sub: "Paste .mcp.json, settings.json or ~/.claude.json. We flag tools that went stale or have a better replacement.",
    privacy: "Runs entirely in your browser. Nothing is uploaded.",
    placeholder: '{ "mcpServers": { ... } }',
    inputLabel: "Config file contents",
    check: "Check",
    sample: "Try an example",
    errNone: "No mcpServers or enabledPlugins found. Paste the contents of .mcp.json, settings.json or ~/.claude.json.",
    errJson: "That isn't valid JSON. Paste the file contents exactly as they are.",
    flagged: "{flagged} of {total} need a look.",
    allGood: "All {total} look fine.",
    lastPush: "Last push {date}",
    status: { swap: "Swap", archived: "Archived", stale: "Stale", fresh: "Active", unknown: "Not tracked" },
  },
  legend: {
    freshness: "Freshness",
    levels: [
      { tone: "fresh", range: "70–100", text: "Active. Pushed within the last ~2 weeks." },
      { tone: "aging", range: "40–69", text: "Slowing down. No push for 2–6 weeks." },
      { tone: "stale", range: "0–39", text: "Stale or archived. Look for an alternative." },
    ],
    growthBody: "“+N in 7d” is how many stars a repo gained over the last week. New repos show “Collecting history” until we have two days of data.",
  },
};

const ko: typeof en = {
  metaDescription: "Claude Code, MCP, 에이전트 도구를 매일 추적합니다. 낡은 도구를 찾고 무엇으로 바꾸면 되는지 알려줍니다.",
  searchPlaceholder: "“브라우저 자동화”처럼 하고 싶은 일로 검색",
  searchLabel: "도구 검색",
  heroTitle: "지난주에 설치한 플러그인이 벌써 구버전일 수 있습니다",
  heroLead:
    "Molt는 Claude Code 플러그인, MCP 서버, 스킬, 에이전트 도구를 매일 추적합니다. 더 나은 게 나오면 무엇으로, 왜, 얼마나 쉽게 바꿀 수 있는지 알려줍니다.",
  updated: "업데이트",
  tracked: "추적 중인 리포 {n}개",
  swapCount: "교체 추천 {n}건",
  steps: [
    { title: "추적", body: "매일 아침 GitHub 리포 {n}개의 스타, 마지막 push, 보관 여부를 가져오고 토픽으로 새 리포를 찾습니다." },
    { title: "점수", body: "신선도는 100에서 시작해 push가 없으면 30일마다 절반이 됩니다. 보관된 리포는 0입니다." },
    { title: "교체", body: "관리가 끊겼거나 확실히 나은 도구가 있으면, 대체할 도구와 옮기는 난이도를 보여줍니다." },
  ],
  categories: { all: "전체", "claude-code": "Claude Code", mcp: "MCP 서버", skills: "스킬", agents: "에이전트", guides: "목록·가이드" },
  categoryLabel: "카테고리",
  swapsTitle: "교체 추천",
  swapsSub: "쓰고 있을지 모르는 도구보다 나은 대안입니다. 카드마다 이유와 바꾸는 난이도를 적었습니다.",
  swapsEmpty: "이 조건에 맞는 교체 추천이 아직 없습니다.",
  oldArchived: "관리 중단",
  oldWorking: "아직 동작",
  replaces: "대체",
  trendingTitle: "이번 주 급상승",
  trendingSub: "최근 7일 동안 늘어난 스타 순서입니다. 같으면 전체 스타 수로 정렬합니다.",
  trendingEmpty: "검색 결과가 없습니다. 다른 단어로 찾아보세요.",
  collecting: "기록 수집 중",
  gain: "{d}일간 +{n}",
  pushed: "{when} push",
  stack: {
    title: "내 스택 점검",
    sub: ".mcp.json, settings.json, ~/.claude.json 내용을 붙여넣으면 낡았거나 더 나은 대안이 있는 도구를 표시합니다.",
    privacy: "브라우저 안에서만 처리하고 어디에도 올리지 않습니다.",
    placeholder: '{ "mcpServers": { ... } }',
    inputLabel: "설정 파일 내용",
    check: "점검하기",
    sample: "예시로 해보기",
    errNone: "mcpServers나 enabledPlugins를 찾지 못했습니다. .mcp.json, settings.json, ~/.claude.json 내용을 붙여넣어 주세요.",
    errJson: "JSON 형식이 아닙니다. 파일 내용을 그대로 붙여넣었는지 확인해 주세요.",
    flagged: "{total}개 중 {flagged}개를 확인해 보세요.",
    allGood: "{total}개 모두 문제없습니다.",
    lastPush: "마지막 push {date}",
    status: { swap: "교체 추천", archived: "관리 중단", stale: "오래됨", fresh: "활발", unknown: "추적 안 함" },
  },
  legend: {
    freshness: "신선도",
    levels: [
      { tone: "fresh", range: "70–100", text: "활발. 최근 2주 안에 push가 있었습니다." },
      { tone: "aging", range: "40–69", text: "느려지는 중. 2–6주 동안 push가 없습니다." },
      { tone: "stale", range: "0–39", text: "오래됐거나 보관됨. 대안을 찾아보세요." },
    ],
    growthBody: "“7일간 +N”은 지난 일주일 동안 늘어난 스타 수입니다. 새로 들어온 리포는 이틀 치 기록이 쌓일 때까지 “기록 수집 중”으로 나옵니다.",
  },
};

export const dict = { en, ko };
export type Dict = typeof en;
