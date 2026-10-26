import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // 영어가 기본: "/"는 /en 페이지를 보여주고, /en으로 들어오면 "/"로 보낸다.
  async rewrites() {
    return [{ source: "/", destination: "/en" }];
  },
  async redirects() {
    return [{ source: "/en", destination: "/", permanent: true }];
  },
};

export default nextConfig;
