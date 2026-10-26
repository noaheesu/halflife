import type { Swap } from "@/lib/types";

export default function SwapCard({ swap }: { swap: Swap }) {
  const archived = swap.from.status === "archived";
  return (
    <article className="swap">
      <div className="pair">
        <div className="tool old">
          <div className="nm">{swap.from.name}</div>
          <div className="rp">{swap.from.detail}</div>
        </div>
        <div className="arrow" aria-label="대체">→</div>
        <div className="tool">
          <div className="nm">{swap.to.name}</div>
          <div className="rp">{swap.to.detail}</div>
        </div>
      </div>
      <p className="why">{swap.reason}</p>
      <div className="foot">
        <span className={`pill ${archived ? "p-stale" : "p-aging"}`}>기존: {archived ? "관리 중단" : "아직 동작"}</span>
        <span className="pill p-acc">{swap.effort}</span>
      </div>
    </article>
  );
}
