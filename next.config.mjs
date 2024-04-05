/** @type {import('next').NextConfig} */
const nextConfig = 
{
  serverRuntimeConfig: 'node',
    experimental: {
      
        serverComponentsExternalPackages: ["fabric-ca-client" ,"fabric-network"],
      },
};

export default nextConfig;
