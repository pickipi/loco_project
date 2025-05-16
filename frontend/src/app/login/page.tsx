"use client"

import { useState } from "react"
import styles from "./page.module.css"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>게스트 로그인</h2>
        
        <div className={styles.socialLogin}>
          <button className={`${styles.socialButton} ${styles.naver}`}>
            네이버로 로그인
          </button>
          <button className={`${styles.socialButton} ${styles.kakao}`}>
            카카오로 로그인
          </button>
          <button className={`${styles.socialButton} ${styles.apple}`}>
            Apple로 로그인
          </button>
        </div>

        <div className={styles.divider}>
          <span>또는</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              로그인 기억하기
            </label>
            <Link href="/forgot-password" className={styles.forgotPassword}>
              비밀번호 찾기
            </Link>
          </div>

          <button type="submit" className={styles.loginButton}>
            이메일로 로그인
          </button>
        </form>

        <div className={styles.signup}>
          <p>
            아직 LoCo 회원이 아니신가요?{" "}
            <Link href="/signup">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
} 