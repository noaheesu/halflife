# Halflife

Claude Code, MCP, Skills, 에이전트 도구를 매일 모아서 보여주고, 낡은 도구는 무엇으로 바꾸면 되는지 알려주는 웹.

```bash
npm install
npm run dev                                   # http://localhost:3000
GITHUB_TOKEN=$(gh auth token) npm run crawl   # data/tools.json 갱신
npm test
```

- `scripts/crawl.ts`: GitHub API로 리포를 갱신하고 토픽 검색으로 새 리포를 찾는다.
- `lib/freshness.ts`: 신선도 점수(마지막 push 후 30일마다 절반)와 급상승 순위.
- `data/swaps.json`: 교체 추천. 지금은 직접 작성한다.
