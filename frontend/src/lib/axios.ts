import axios from 'axios';

/**
 * axios 인스턴스 생성
 * 모든 API 요청에 공통적으로 적용될 기본 설정
 */
const api = axios.create({
  // API 서버의 기본 주소 설정 (환경 변수에서 가져옴)
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1",
  
  // 요청 제한 시간 설정 (5초)
  timeout: 10000,
  
  // 기본 헤더 설정
  headers: {
    // 요청 본문의 타입을 JSON으로 지정
    'Content-Type': 'application/json',
  },
  
  // 쿠키를 포함한 요청 허용
  withCredentials: true,
});

// 인증이 필요하지 않은 public API 경로 목록
const publicPaths = [
  '/auth/send-code',  // 메일 인증 코드 발송
  '/auth/verify-code', // 메일 인증 코드 확인
  '/auth/login',      // 로그인
  '/auth/signup',     // 회원가입
];

// 🔐 요청 시 자동으로 Authorization 헤더 붙이기
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 사용 예시:
 * 
 * import api from '@/lib/axios';
 * 
 * // GET 요청
 * const response = await api.get('/endpoint');
 * 
 * // POST 요청
 * const response = await api.post('/endpoint', data);
 */

export default api; 