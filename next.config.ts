import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repository = "https://github.com/junheeLee96/openstyling";

const nextConfig: NextConfig = {
  // output: "export",
  images: {
    unoptimized: true,
    domains: [
      "openweathermap.org",
      "shopping-phinf.pstatic.net",
      "oaidalleapiprodscus.blob.core.windows.net",
    ],
  },
};

export default nextConfig;
