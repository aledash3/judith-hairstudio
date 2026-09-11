/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' solo se activa en entornos Linux/Docker (DOCKER_BUILD=1) para evitar EPERM symlink en Windows
  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,
  serverExternalPackages: ['sharp'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  }
};

export default nextConfig;
