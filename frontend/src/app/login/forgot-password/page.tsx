'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      router.push('/login');
    }
  }, [countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/guests/forgot-password`, {
        email: email,
      });

      if (response.data.resultCode === 'S-1') {
        setMsg('임시 비밀번호가 이메일로 전송되었습니다.');
        setCountdown(3);
      }
    } catch (err: any) {
      if (!err.response) {
        // 네트워크 오류 또는 서버 응답 없음
        setError('서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      
      const backendMsg = err.response?.data?.message || err.response?.data?.msg;
      setError(backendMsg || '요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', paddingTop: '40px' }}>
      <div className={styles.container}>
        <h2 className={styles.title}>비밀번호 찾기</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              이메일 주소
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className={styles.input}
                disabled={loading}
              />
            </label>
          </div>
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? '전송 중...' : '임시 비밀번호 받기'}
          </button>
        </form>
        {msg && (
          <p className={styles.successMessage}>
            {msg}
            <br/>
            {countdown !== null && `잠시 후 ${countdown}초 후 로그인 페이지로 이동합니다.`}
          </p>
        )}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;