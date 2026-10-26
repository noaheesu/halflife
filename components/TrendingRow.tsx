import { freshnessLevel } from "@/lib/freshness";
import { fill, type Dict, type Lang } from "@/lib/i18n";
import type { RankedTool } from "@/lib/types";

const W = 140;
const H = 32;
const PAD = 4;

function Sparkline({ values, level }: { values: number[]; level: string }) {
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (W - 3), H - PAD - ((v - min) / span) * (H - PAD * 2)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [ex, ey] = pts[pts.length - 1];
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path d={`${line} L${W - 3} ${H} L0 ${H}Z`} fill={`var(--${level}-soft)`} />
      <path d={line} fill="none" stroke={`var(--${level})`} strokeWidth="1.5" />
      <circle cx={ex} cy={ey} r="2.5" fill={`var(--${level})`} />
    </svg>
  );
}

// 렌더링마다 만들지 않도록 언어별로 한 번만 만든다
const compact = {
  en: new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }),
  ko: new Intl.NumberFormat("ko", { notation: "compact", maximumFractionDigits: 1 }),
};
const relative = {
  en: new Intl.RelativeTimeFormat("en", { numeric: "auto" }),
  ko: new Intl.RelativeTimeFormat("ko", { numeric: "auto" }),
};

type Props = { tool: RankedTool; rank: number; lang: Lang; t: Dict };

export default function TrendingRow({ tool, rank, lang, t }: Props) {
  const level = freshnessLevel(tool.freshness);
  const description = lang === "ko" ? (tool.descriptionKo ?? tool.description) : tool.description;
  return (
    <li className="row">
      <span className="rank">{rank}</span>
      <div className="row-main">
        <div className="row-title">
          <a className="nm" href={`https://github.com/${tool.repo}`} target="_blank" rel="noreferrer">
            {tool.name}
          </a>
          <span className="cat">{t.categories[tool.category]}</span>
        </div>
        {description && <p className="ds">{description}</p>}
        <div className="row-meta">
          <span className={`hl hl-${level}`}>
            <i><span style={{ width: `${tool.freshness}%` }} /></i>
            <b>{tool.freshness}</b>
            {fill(t.pushed, { when: relative[lang].format(-tool.idleDays, "day") })}
          </span>
          {tool.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
      <div className="stats">
        {tool.starHistory.length > 1 && <Sparkline values={tool.starHistory} level={level} />}
        <span className="stars">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg>
          {compact[lang].format(tool.stars)}
        </span>
        <span className={tool.gainDays ? "gain" : "gain muted"}>
          {tool.gainDays ? fill(t.gain, { n: compact[lang].format(tool.starGain), d: tool.gainDays }) : t.collecting}
        </span>
      </div>
    </li>
  );
}
