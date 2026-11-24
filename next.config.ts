import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.16.*.*", "*.local"],
};

export default nextConfig;
