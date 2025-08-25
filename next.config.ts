import type { NextConfig } from "next";

import { MAX_FILE_SIZE_IN_MB } from "@/features/attachments/constants";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["src"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: `${MAX_FILE_SIZE_IN_MB}mb`,
    },
  },
};

export default nextConfig;
