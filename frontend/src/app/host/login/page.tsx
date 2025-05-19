'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './page.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // TODO: 실제 로그인 로직 구현
      console.log('Login attempt:', { email, password })
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>로그인</h1>
        
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
