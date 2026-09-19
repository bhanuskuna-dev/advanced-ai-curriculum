import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/modules/*/*": ["./content/**/*.md"],
    "/modules/*/project": ["./content/**/*.md"],
  },
};

export default nextConfig;
