import Feed from "@/components/Feed";
import swaps from "@/data/swaps.json";
import data from "@/data/tools.json";
import { rank } from "@/lib/freshness";
import type { Swap, Tool } from "@/lib/types";

// 서버 컴포넌트: 빌드할 때 한 번 실행돼서 정적 HTML이 된다.
// 신선도는 크롤링 시각 기준으로 잰다. 빌드가 늦어져도 점수가 흔들리지 않는다.
export default function Home() {
  return (
    <Feed
      tools={rank(data.tools as Tool[], new Date(data.updatedAt))}
      swaps={swaps as Swap[]}
      updatedAt={data.updatedAt}
    />
  );
}
