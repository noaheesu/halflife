// shortcut: 고정된 예시 목록, 4단계에서 설정 파일 붙여넣기 분석으로 교체
const SAMPLE = [
  { name: "Puppeteer MCP", label: "교체 추천", tone: "p-stale" },
  { name: "GitHub MCP", label: "최신", tone: "p-fresh" },
  { name: "슬래시 커맨드 4개", label: "대안 있음", tone: "p-aging" },
  { name: "Context7", label: "최신", tone: "p-fresh" },
];

export default function StackPanel() {
  return (
    <aside>
      <div className="stack">
        <h2>내 스택</h2>
        <p className="sub" style={{ margin: 0 }}>쓰는 도구를 등록하거나 settings.json을 붙여넣으면 낡은 것을 찾아드립니다.</p>
        <ul>
          {SAMPLE.map((s) => (
            <li key={s.name}>
              <span>{s.name}</span>
              <span className={`pill ${s.tone}`}>{s.label}</span>
            </li>
          ))}
        </ul>
        <div className="alert">4개 중 2개에 더 나은 대안이 있습니다.</div>
      </div>
    </aside>
  );
}
