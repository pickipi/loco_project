/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // S3 버킷의 호스트명(버킷명.s3.리전.amazonaws.com)
      'loco-project-s3-image.s3.ap-northeast-2.amazonaws.com'
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
