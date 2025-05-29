/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com", "ui-avatars.com", "localhost"],
  },
  // API 라우트 리다이렉션 설정
  async rewrites() {
    return [
      {
        source: '/api/auth/check',
        destination: '/api/auth/check',
      },
    ]
  },
};

module.exports = nextConfig;
