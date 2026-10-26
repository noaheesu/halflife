import type { Dict } from "@/lib/i18n";

// 급상승 목록 바로 위에서 신선도 색과 스타 증가 표기를 설명한다
export default function Legend({ t }: { t: Dict }) {
  return (
    <div className="legend">
      <div className="legend-row">
        <span className="legend-label">{t.legend.freshness}</span>
        {t.legend.levels.map((l) => (
          <span key={l.tone} className="legend-item">
            <span className={`pill p-${l.tone}`}>{l.range}</span>
            {l.text}
          </span>
        ))}
      </div>
      <p>{t.legend.growthBody}</p>
    </div>
  );
}
