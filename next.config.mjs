/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["fabric-ca-client" ,"fabric-network"],
      },
};

export default nextConfig;
