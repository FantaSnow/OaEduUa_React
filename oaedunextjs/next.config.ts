import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    const backendUrl =
      process.env.API_BACKEND_URL || "http://localhost:8000";
    // Якщо бекенд підключає роутери з префіксом /api (наприклад include_router(..., prefix="/api")),
    // встановіть API_BACKEND_PREFIX=api у .env.local
    const apiPrefix = process.env.API_BACKEND_PREFIX || "";
    const destinationPath = apiPrefix
      ? `${backendUrl}/${apiPrefix}/:path*`
      : `${backendUrl}/:path*`;
    return [
      {
        source: "/api/:path*",
        destination: destinationPath,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
