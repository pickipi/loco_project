'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import EmailVerificationButton from '@/components/emailverification/EmailVerificationButton'
import styles from './page.module.css'
import api from '@/lib/axios'

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090';

interface SignupData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: string;
}

export default function HostRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';

  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: emailFromUrl,  // URL에서 가져온 이메일로 초기화
    password: '',
    phoneNumber: '',
    userType: 'HOST'
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // URL에서 이메일이 전달된 경우 이메일 인증 상태를 true로 설정
  useEffect(() => {
    if (emailFromUrl) {
      setIsEmailVerified(true);
    }
  }, [emailFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 이메일이 변경되면 인증 상태 초기화
    if (name === 'email') {
      setIsEmailVerified(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 이메일 인증 확인
    if (!isEmailVerified) {
      setError('이메일 인증이 필요합니다.');
      return;
    }

    // 비밀번호 확인 검증
    if (formData.password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await api.post('/users/host', {
        ...formData,
        userType: 'HOST'
      });

      // 성공 시 완료 페이지로 이동
      router.push('/host/signup/complete');
    } catch (err: any) {
      console.error('회원가입 오류:', err);
      console.error('에러 응답:', err.response?.data);
      const errorMessage = err.response?.data?.message || '회원가입 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>회원가입</h1>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              이름
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            {emailFromUrl ? (
              // 소셜로그인에서 온 경우: 읽기 전용 이메일 필드
              <>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className={`${styles.input} ${styles.readOnlyInput}`}
                />
                <p className={styles.verifiedText}>✓ 소셜로그인으로 인증된 이메일입니다.</p>
              </>
            ) : (
              // 일반 회원가입: 이메일 인증 버튼
              <>
                <EmailVerificationButton 
                  email={formData.email} 
                  onVerified={() => setIsEmailVerified(true)}
                  onChange={(email) => setFormData(prev => ({ ...prev, email }))}
                />
                {isEmailVerified && (
                  <p className={styles.verifiedText}>✓ 이메일이 인증되었습니다.</p>
                )}
              </>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>
              전화번호
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="010-0000-0000"
              pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
              className={styles.input}
              required
            />
            <p className={styles.helpText}>
              하이픈(-)을 포함하여 입력해주세요
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <p className={styles.helpText}>
              8자 이상의 영문, 숫자, 특수문자를 조합해주세요
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="passwordConfirm" className={styles.label}>
              비밀번호 확인
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.buttonContainer}>
            <Link
              href="/host"
              className={styles.backButton}
            >
              뒤로가기
            </Link>
            <button
              type="submit"
              disabled={isLoading || !isEmailVerified}
              className={styles.submitButton}
            >
              {isLoading ? '처리중...' : '가입하기'}
            </button>
          </div>

          <div className={styles.loginText}>
            이미 계정이 있으신가요?{' '}
            <Link href="/host/login" className={styles.loginLink}>
              로그인하기
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
} 