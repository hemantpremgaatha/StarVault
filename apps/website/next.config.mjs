/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? "/StarVault" : "",
  assetPrefix: isGithubPages ? "/StarVault/" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/StarVault" : ""
  },
  images: {
    unoptimized: true
  },
  transpilePackages: ["@starvault/protocol", "@starvault/shared-types"]
};

export default nextConfig;
