'use client'

import { useState } from 'react'
import styles from './EmailVerification.module.css'
import api from '@/lib/axios'

interface EmailVerificationButtonProps {
  email: string;
  onVerified?: () => void;
  onChange?: (email: string) => void;
}

export default function EmailVerificationButton({ email, onVerified, onChange }: EmailVerificationButtonProps) {
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    const sendCode = async () => {
      if (!email) {
        alert("이메일을 입력해주세요.");
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await api.post(`/users/emails/verification-requests?email=${email}`);
        console.log("📨 인증코드 전송 응답:", response);
        setSent(true);
        alert("인증 코드가 전송되었습니다. 이메일을 확인해주세요.");
      } catch (error) {
        console.error('인증 코드 전송 실패:', error);
        alert('인증 코드 전송에 실패했습니다. 다시 시도해주세요.');
        setSent(false);
      } finally {
        setIsLoading(false);
      }
    };
  
    const verifyCode = async () => {
      if (!code) {
        alert("인증 코드를 입력해주세요.");
        return;
      }

      try {
        setIsLoading(true);
        console.log("📩 인증 시도:", { email: email.trim(), code: code.trim() });
        const res = await api.get(`/users/emails/verifications`, {
          params: { 
            email: email.trim(), 
            code: code.trim() 
          }
        });
        console.log("📩 인증 응답:", res.data);

        if (res.data.data === true) {
          alert("이메일 인증이 완료되었습니다!");
          onVerified?.();
        } else {
          alert("인증 코드가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error('인증 코드 확인 실패:', error);
        alert('인증 코드 확인에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className={styles.verificationContainer}>
        <div className={styles.emailInputContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => onChange?.(e.target.value)}
            className={styles.input}
            placeholder="이메일을 입력하세요"
            required
          />
          <button 
            type="button" 
            onClick={sendCode}
            className={styles.verificationButton}
            disabled={!email || isLoading}
          >
            {isLoading ? "전송중..." : "인증코드 보내기"}
          </button>
        </div>
        
        {sent && (
          <div className={styles.verifyCodeContainer}>
            <input 
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="인증코드 6자리"
              maxLength={6}
              className={styles.codeInput}
            />
            <button
              type="button"
              onClick={verifyCode}
              className={styles.verificationButton}
              disabled={!code || isLoading}
            >
              {isLoading ? "인증중..." : "인증하기"}
            </button>
          </div>
        )}
      </div>
    );
  }