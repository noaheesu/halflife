import type { Dict, Lang } from "@/lib/i18n";
import type { Swap } from "@/lib/types";

export default function SwapCard({ swap, lang, t }: { swap: Swap; lang: Lang; t: Dict }) {
  const archived = swap.from.status === "archived";
  return (
    <article className="swap">
      <div className="pair">
        <div className="tool old">
          <span className="nm">{swap.from.name[lang]}</span>
          <code>{swap.from.detail}</code>
        </div>
        <span className="arrow" aria-label={t.replaces}>→</span>
        <div className="tool">
          <span className="nm">{swap.to.name}</span>
          <code>{swap.to.detail}</code>
        </div>
      </div>
      <p className="why">{swap.reason[lang]}</p>
      <div className="foot">
        <span className={`pill ${archived ? "p-stale" : "p-aging"}`}>{archived ? t.oldArchived : t.oldWorking}</span>
        <span className="pill p-acc">{swap.effort[lang]}</span>
      </div>
    </article>
  );
}
