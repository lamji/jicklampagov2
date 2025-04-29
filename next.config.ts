/** @format */

import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {},
  devIndicators: {
    buildActivity: true,
  },
  async generateBuildId() {
    return "my-build-id";
  },
};

export default config;
