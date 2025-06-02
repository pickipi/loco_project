/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // S3 버킷의 호스트명(버킷명.s3.리전.amazonaws.com)
      'loco-project-s3-image.s3.ap-northeast-2.amazonaws.com',
      // UI Avatars API 도메인
      'ui-avatars.com',
      // 만약 개발 중에 `http://localhost:8090/images/1234` 같은 경로를 사용한다면
      'localhost',
    ],
    // 또는 패턴 기반으로 허용하고 싶다면 아래처럼 remotePatterns를 사용할 수도 있습니다.
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'loco-project-s3-image.s3.ap-northeast-2.amazonaws.com',
    //     port: '',
    //     pathname: '/**', 
    //   },
    // ],
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
