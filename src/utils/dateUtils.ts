/**
 * 날짜만 추출하는 함수
 * @param timestamp - 'YYYY년 M월 D일 오전/오후 HH:MM' 형식의 타임스탬프
 * @returns 'YYYY년 M월 D일' 형식의 문자열
 */
export const extractDate = (timestamp: string): string => {
  const match = timestamp.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/);
  if (!match) return '';
  return `${match[1]}년 ${match[2]}월 ${match[3]}일`;
};

/**
 * 시간만 추출하는 함수
 * @param timestamp - 'YYYY년 M월 D일 오전/오후 HH:MM' 형식의 타임스탬프
 * @returns '오전/오후 HH:MM' 형식의 문자열
 */
export const extractTime = (timestamp: string): string => {
  const match = timestamp.match(/(오전|오후) (\d{1,2}:\d{2})/);
  if (!match) return '';
  return `${match[1]} ${match[2]}`;
};

/**
 * 타임스탬프를 Date 객체로 변환하는 함수
 * @param timestamp - 'YYYY년 M월 D일 오전/오후 HH:MM' 형식의 타임스탬프
 * @returns Date 객체
 */
export const getDateFromTimestamp = (timestamp: string): Date => {
  try {
    const now = new Date();
    const parts = timestamp.split(' ');
    
    // 날짜 정보가 있는 경우 (예: "2025년 5월 13일 오전 10:36")
    if (parts[0].includes('년')) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      const period = parts[3];
      const [hours, minutes] = parts[4].split(':').map(Number);

      let hour = hours;
      if (period === '오후' && hours !== 12) {
        hour = hours + 12;
      } else if (period === '오전' && hours === 12) {
        hour = 0;
      }

      return new Date(year, month, day, hour, minutes);
    }
    
    // 시간만 있는 경우 (예: "오전 10:36")
    const period = parts[0];
    const [hours, minutes] = parts[1].split(':').map(Number);
    
    let hour = hours;
    if (period === '오후' && hours !== 12) {
      hour = hours + 12;
    } else if (period === '오전' && hours === 12) {
      hour = 0;
    }

    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes);
  } catch (error) {
    return new Date();
  }
};

/**
 * 현재 시간을 'YYYY년 M월 D일 오전/오후 HH:MM' 형식으로 반환하는 함수
 * @returns 'YYYY년 M월 D일 오전/오후 HH:MM' 형식의 문자열
 */
export const formatCurrentTime = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // 오전/오후 구분
  const period = hours < 12 ? '오전' : '오후';
  
  // 12시간제로 변환
  const hour12 = hours % 12 || 12;
  
  // 분이 한 자리 수일 경우 앞에 0 추가
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${year}년 ${month}월 ${day}일 ${period} ${hour12}:${minutesStr}`;
}; 