"use client"

import { useState } from "react"
import styles from "./page.module.css"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  })
  
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    ageVerification: false,
    marketingSMS: false,
    marketingEmail: false,
  })

  const [allAgreed, setAllAgreed] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setAgreements(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleAllAgreements = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setAllAgreed(checked)
    setAgreements({
      termsOfService: checked,
      privacyPolicy: checked,
      ageVerification: checked,
      marketingSMS: checked,
      marketingEmail: checked,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement signup logic
    console.log('Form Data:', formData)
    console.log('Agreements:', agreements)
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h2>회원가입</h2>
        
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

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="전화번호 (- 없이 입력)"
              value={formData.phone}
              onChange={handleInputChange}
              pattern="[0-9]*"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <p className={styles.passwordGuide}>
              - 문자/숫자/특수문자 중 2가지 이상 조합 (8~30자)<br />
              - 3개 이상 키보드 상 배열이 연속되거나 동일한 문자/숫자 제외
            </p>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.agreementSection}>
            <label className={styles.agreementAll}>
              <input
                type="checkbox"
                checked={allAgreed}
                onChange={handleAllAgreements}
              />
              <span>아래 약관에 모두 동의합니다.</span>
            </label>

            <div className={styles.agreements}>
              <label>
                <input
                  type="checkbox"
                  name="termsOfService"
                  checked={agreements.termsOfService}
                  onChange={handleAgreementChange}
                  required
                />
                <span>서비스 이용약관 (필수)</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="privacyPolicy"
                  checked={agreements.privacyPolicy}
                  onChange={handleAgreementChange}
                  required
                />
                <span>개인정보 수집 및 이용 (필수)</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="ageVerification"
                  checked={agreements.ageVerification}
                  onChange={handleAgreementChange}
                  required
                />
                <span>본인은 만 14세 이상입니다. (필수)</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="marketingSMS"
                  checked={agreements.marketingSMS}
                  onChange={handleAgreementChange}
                />
                <span>이벤트 등 프로모션 알림 SMS 수신 (선택)</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="marketingEmail"
                  checked={agreements.marketingEmail}
                  onChange={handleAgreementChange}
                />
                <span>이벤트 등 프로모션 알림 메일 수신 (선택)</span>
              </label>
            </div>
          </div>

          <button type="submit" className={styles.signupButton}>
            회원가입
          </button>
        </form>

        <div className={styles.login}>
          <p>
            이미 LoCo 회원이신가요?{" "}
            <Link href="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  )
} 