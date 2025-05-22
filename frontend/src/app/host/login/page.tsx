'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './page.module.css'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8090/api/v1/hosts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', data.token);
        
        // 토큰이 제대로 저장되었는지 확인
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
          throw new Error('토큰 저장에 실패했습니다.');
        }

        // 커스텀 이벤트 발생
        window.dispatchEvent(new Event('tokenChange'));
        
        alert('로그인 성공!');
        router.push('/host/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>호스트 로그인</h1>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.rememberMeContainer}>
            <div className={styles.checkbox}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={styles.checkboxInput}
              />
              <label htmlFor="remember-me" className={styles.checkboxLabel}>
                로그인 상태 유지
              </label>
            </div>

            <Link href="/host/forgot-password" className={styles.forgotPassword}>
              비밀번호 찾기
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <div className={styles.signupText}>
            아직 계정이 없으신가요?{' '}
            <Link href="/host/signup" className={styles.signupLink}>
              회원가입하기
            </Link>
          </div>
        </form>

        {/* 소셜 로그인 */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerText}>또는</div>
        </div>

        <div className={styles.socialButtons}>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true)
              // TODO: Google 로그인 구현
            }}
            disabled={isLoading}
            className={styles.socialButton}
          >
            <img
              className={styles.socialIcon}
              src="https://www.svgrepo.com/show/475647/google-color.svg"
              alt="Google logo"
            />
            Google로 계속하기
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true)
              // TODO: Kakao 로그인 구현
            }}
            disabled={isLoading}
            className={styles.socialButton}
          >
            <img
              className={styles.socialIcon}
              src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
              alt="Kakao logo"
            />
            카카오로 계속하기
          </button>
        </div>
      </div>
    </main>
  )
}
