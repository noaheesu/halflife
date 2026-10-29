# Molt

[English](#english) · [한국어](#한국어)

## English

A website that tracks Claude Code plugins, MCP servers, skills, and agent tools every day, and tells you what to replace stale tools with.

*Molt*: shed the old shell, grow into what's alive.

- Site: https://halflife-3tuy.vercel.app (English `/`, Korean `/ko`)
- Repo: https://github.com/noaheesu/molt (public)
- The local folder still uses the old name (`news_crawler`).

### Run

```bash
npm install
npm run dev                                   # http://localhost:3000
npm test                                      # lib/*.test.ts (node --test, no dependencies)
GITHUB_TOKEN=$(gh auth token) npm run crawl   # refresh data/tools.json
```

Requires Node 24+. The crawler and tests run `.ts` files directly in Node (type stripping).

### Structure

```
.github/workflows/crawl.yml  Daily 09:00 KST: test → crawl → commit data/tools.json → Vercel auto-deploy
scripts/crawl.ts             Refresh tracked repos via the GitHub API + discover new repos by topic search
lib/
  types.ts                   Tool, Swap, RankedTool
  merge.ts                   GitHub response → Tool, MCP relevance filter
  freshness.ts               Freshness score, trending rank
  stack.ts                   "Check my stack": config file parsing and matching
  i18n.ts                    en/ko dictionary (ko is typeof en, so a missing key fails the build)
app/[lang]/                  en and ko pages, statically generated at build. "/" rewrites to /en
components/                  Feed (search, filter), SwapCard, TrendingRow, StackPanel, Legend
data/
  tools.json                 Data written by the crawler { updatedAt, tools[] }
  swaps.json                 Replacement suggestions (hand-written, en/ko)
  excluded.json              Repos the crawler must skip, with reasons
```

### Key rules

- **Freshness**: halves every 30 days since the last push, measured at crawl time. Archived repos score 0. 70+ is active, 40–69 is slowing, below that is stale.
- **Trending**: 7-day star growth from `starHistory`, which stores one entry per day. A second crawl on the same day overwrites the last entry.
- **Hand edits are kept**: the crawler never overwrites `name`, `description`, `descriptionKo`, `category`, or `tags`; it only refreshes numbers. Fix categories directly in `tools.json`.
- **Discovery**: only repos with 300+ stars and activity in the last 90 days, from topics `claude-code`, `mcp-server`, `agent-skills`, `claude-agent-sdk`. Repos found via `mcp-server` must mention MCP in their name or description.
- **Check my stack**: finds `mcpServers` and `enabledPlugins` in pasted JSON and matches them in the browser only. `env` is never read. Repo names shorter than 6 characters are not auto-matched.

### Editing data

- Exclude a repo: add `{ "repo": "owner/name", "reason": "..." }` to `data/excluded.json`
- Add a replacement: add an entry to `data/swaps.json`. Put keywords (package names, etc.) that identify the old tool in a config file into `match`.
- Korean description: add `descriptionKo` to the repo in `tools.json`

### To do

1. Confirm Vercel auto-deploys after bot commits. The repo is now public, so the Hobby plan's private-repo limit no longer applies. If it still doesn't, call a Deploy Hook from the workflow.
2. Mobile: no horizontal overflow confirmed in 375px and 320px iframes. Not yet checked on a real device.
3. 9 replacement suggestions (mostly archived MCP reference servers). Remaining candidates: servers with no clear successor yet such as gdrive, google-maps, sqlite, and the Skills/Agents categories beyond MCP.
4. With a Claude API key: auto-generate Korean descriptions for crawled repos and auto-suggest alternatives for unmaintained tools.
5. Rename the Vercel project for a shorter URL.
6. Revoke the leftover `delete_repo` scope on the `gh` token: `gh auth refresh -h github.com -r delete_repo`

---

## 한국어

Claude Code 플러그인, MCP 서버, 스킬, 에이전트 도구를 매일 추적하고, 낡은 도구는 무엇으로 바꾸면 되는지 알려주는 웹.

*Molt*(탈피): 낡은 껍질을 벗고 살아 있는 것으로 갈아탄다.

- 사이트: https://halflife-3tuy.vercel.app (영어 `/`, 한국어 `/ko`)
- 리포: https://github.com/noaheesu/molt (공개)
- 로컬 폴더 이름은 예전 이름(`news_crawler`) 그대로다.

### 실행

```bash
npm install
npm run dev                                   # http://localhost:3000
npm test                                      # lib/*.test.ts (node --test, 의존성 없음)
GITHUB_TOKEN=$(gh auth token) npm run crawl   # data/tools.json 갱신
```

Node 24 이상이 필요하다. 크롤러와 테스트는 `.ts` 파일을 Node가 직접 실행한다(type stripping).

### 구조

```
.github/workflows/crawl.yml  매일 09:00 KST: 테스트 → 크롤링 → data/tools.json 커밋 → Vercel 자동 배포
scripts/crawl.ts             GitHub API로 추적 중인 리포 갱신 + 토픽 검색으로 새 리포 발견
lib/
  types.ts                   Tool, Swap, RankedTool
  merge.ts                   GitHub 응답 → Tool 변환, MCP 관련성 필터
  freshness.ts               신선도 점수, 급상승 순위
  stack.ts                   "내 스택 점검": 설정 파일 파싱과 매칭
  i18n.ts                    en/ko 사전 (ko는 typeof en이라 키가 빠지면 빌드 실패)
app/[lang]/                  en, ko 두 페이지를 빌드 때 정적 생성. "/"는 /en으로 rewrite
components/                  Feed(검색·필터), SwapCard, TrendingRow, StackPanel, Legend
data/
  tools.json                 크롤러가 쓰는 데이터 { updatedAt, tools[] }
  swaps.json                 교체 추천 (사람이 작성, en/ko)
  excluded.json              크롤러가 넣지 않을 리포와 이유
```

### 핵심 규칙

- **신선도**: 크롤링 시각 기준으로 마지막 push 후 30일마다 절반이 된다. 보관된 리포는 0. 70 이상은 활발, 40–69는 느려지는 중, 그 아래는 오래됨.
- **급상승**: `starHistory`에 하루 1칸씩 쌓인 스타 수로 최근 7일 증가량을 계산한다. 같은 날 다시 크롤링하면 마지막 칸을 덮어쓴다.
- **사람이 고친 값 유지**: 크롤러는 `name`, `description`, `descriptionKo`, `category`, `tags`를 덮어쓰지 않고 수치만 갱신한다. 카테고리는 `tools.json`에서 직접 고치면 된다.
- **새 리포 발견**: 토픽 `claude-code`, `mcp-server`, `agent-skills`, `claude-agent-sdk`에서 스타 300개 이상, 90일 안에 활동이 있는 리포만 가져온다. `mcp-server`로 찾은 리포는 이름이나 설명에 MCP가 있어야 한다.
- **내 스택 점검**: 붙여넣은 JSON에서 `mcpServers`와 `enabledPlugins`를 찾아 브라우저 안에서만 매칭한다. `env`는 보지 않는다. 리포 이름이 6글자 미만이면 자동 매칭하지 않는다.

### 데이터 손보기

- 리포 빼기: `data/excluded.json`에 `{ "repo": "owner/name", "reason": "..." }` 추가
- 교체 추천 추가: `data/swaps.json`에 항목 추가. `match`에는 설정 파일에서 기존 도구를 알아볼 키워드(패키지명 등)를 넣는다.
- 한국어 설명: `tools.json`의 해당 리포에 `descriptionKo` 추가

### 남은 일

1. 봇 커밋 후 Vercel이 자동 배포하는지 확인. 리포를 공개로 바꿔 Hobby 플랜의 비공개 리포 제한은 사라졌다. 그래도 안 되면 워크플로에서 Deploy Hook을 호출한다.
2. 휴대폰 화면: 375px·320px 폭 iframe으로 가로 넘침이 없는 것까지 확인했다. 실제 기기에서는 아직 보지 못했다.
3. 교체 추천 9건(보관 처리된 MCP 참조 서버 위주). 남은 후보: gdrive, google-maps, sqlite처럼 뚜렷한 대체재가 아직 없는 서버, 그리고 MCP 말고 Skills/Agents 카테고리.
4. Claude API 키가 생기면: 크롤링한 리포의 한국어 설명 자동 생성, 관리가 끊긴 도구의 대안 자동 추천.
5. Vercel 프로젝트 이름을 바꿔 더 짧은 주소 쓰기.
6. `gh` 토큰에 남은 `delete_repo` 권한 회수: `gh auth refresh -h github.com -r delete_repo`
