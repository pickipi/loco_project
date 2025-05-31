'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const router = useRouter();
  const [formData, setFormData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password: string): boolean => {
    // 8~30자 길이 검증
    if (password.length < 8 || password.length > 30) {
      setError('비밀번호는 8~30자 사이여야 합니다.');
      return false;
    }

    // 문자/숫자/특수문자 2가지 이상 조합 검증
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const combinationCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (combinationCount < 2) {
      setError('비밀번호는 문자/숫자/특수문자 중 2가지 이상을 포함해야 합니다.');
      return false;
    }

    // 연속된 문자/숫자 검증
    const consecutive = /(.)\1\1/.test(password); // 동일 문자 3회 연속
    if (consecutive) {
      setError('동일한 문자/숫자를 3회 이상 연속해서 사용할 수 없습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 새 비밀번호와 확인 비밀번호 일치 검증
      if (formData.newPassword !== formData.confirmPassword) {
        setError('새 비밀번호가 일치하지 않습니다.');
        return;
      }

      // 비밀번호 유효성 검사
      if (!validatePassword(formData.newPassword)) {
        return;
      }

      // API 호출
      const response = await fetch(`${API_BASE_URL}/api/v1/hosts/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '비밀번호 변경에 실패했습니다.');
      }

      // 성공 시 프로필 페이지로 이동
      router.push('/host/profile');
    } catch (err) {
      console.error('비밀번호 변경 오류:', err);
      setError(err instanceof Error ? err.message : '비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>비밀번호 변경하기</h1>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <p className={styles.hint}>- 문자/숫자/특수문자 2가지 이상 조합 (8~30자)</p>
          <p className={styles.hint}>- 3개 이상 키보드 상 배열이 연속되거나 동일한 문자/숫자 제외</p>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">새 비밀번호 재입력</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={() => router.back()}
            disabled={isLoading}
          >
            취소
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? '변경 중...' : '변경하기'}
          </button>
        </div>
      </form>
    </div>
  );
} 