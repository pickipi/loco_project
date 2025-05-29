/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
        pathname: '/global/data/image/**',
      },
      // 외부 이미지 도메인 패턴 추가 예시
      // {
      //   protocol: 'https',
      //   hostname: 'picsum.photos',
      //   pathname: '/**',
      // },
    ],
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
