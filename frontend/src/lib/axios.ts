import axios from 'axios';

/**
 * axios 인스턴스 생성
 * 모든 API 요청에 공통적으로 적용될 기본 설정
 */
const api = axios.create({
  // API 서버의 기본 주소 설정 (환경 변수에서 가져옴)
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  
  // 요청 제한 시간 설정 (5초)
  timeout: 5000,
  
  // 기본 헤더 설정
  headers: {
    // 요청 본문의 타입을 JSON으로 지정
    'Content-Type': 'application/json',
  },
});

/**
 * 사용 예시:
 * 
 * import api from '@/lib/axios';
 * 
 * // GET 요청
 * const response = await api.get('/endpoint', {
 *   headers: {
 *     Authorization: `Bearer ${token}`
 *   }
 * });
 * 
 * // POST 요청
 * const response = await api.post('/endpoint', data, {
 *   headers: {
 *     Authorization: `Bearer ${token}`
 *   }
 * });
 */

export default api; 