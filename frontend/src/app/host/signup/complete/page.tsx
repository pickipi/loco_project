'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function SignupCompletePage() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>✨</div>
        <h1 className={styles.title}>회원가입이 완료되었습니다!</h1>
        <p className={styles.description}>
          LOCO 호스트가 되신 것을 환영합니다.<br />
          로그인하여 호스트 서비스를 이용해보세요.
        </p>
        <div className={styles.buttonContainer}>
          <Link href="/host/login" className={styles.loginButton}>
            로그인하기
          </Link>
          <Link href="/host" className={styles.homeButton}>
            홈으로 가기
          </Link>
        </div>
      </div>
    </main>
  )
}
