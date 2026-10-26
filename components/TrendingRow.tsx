import { freshnessLevel } from "@/lib/freshness";
import type { RankedTool } from "@/lib/types";

const W = 120;
const H = 32;
const PAD = 4;

function Sparkline({ values, level }: { values: number[]; level: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - PAD - ((v - min) / span) * (H - PAD * 2)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [ex, ey] = pts[pts.length - 1];
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path d={`${line} L${W} ${H} L0 ${H}Z`} fill={`var(--${level}-soft)`} />
      <path d={line} fill="none" stroke={`var(--${level})`} strokeWidth="1.5" />
      <circle cx={ex - 2.5} cy={ey} r="2.5" fill={`var(--${level})`} />
    </svg>
  );
}

const fmt = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export default function TrendingRow({ tool, rank }: { tool: RankedTool; rank: number }) {
  const level = freshnessLevel(tool.freshness);
  return (
    <li className="row">
      <span className="rank">{rank}</span>
      <div>
        <a className="nm" href={`https://github.com/${tool.repo}`} target="_blank" rel="noreferrer">
          {tool.name}
        </a>
        <div className="ds">{tool.description}</div>
        <div className="tags">
          {tool.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          <span className="hl" title={`마지막 커밋 ${tool.lastCommit}`}>
            <i><span style={{ width: `${tool.freshness}%`, background: `var(--${level})` }} /></i>
            신선도 {tool.freshness}
          </span>
        </div>
      </div>
      <Sparkline values={tool.starHistory} level={level} />
      <div className="stars">
        {fmt.format(tool.stars)}
        <b>{tool.gainDays ? `+${fmt.format(tool.starGain)}/${tool.gainDays}일` : "기록 중"}</b>
      </div>
    </li>
  );
}
