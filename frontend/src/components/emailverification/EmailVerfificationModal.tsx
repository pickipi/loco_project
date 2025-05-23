'use client'

import { useState } from 'react'
import api from '@/lib/axios'

export default function EmailVerificationModal({
    email,
    onClose,
  }: {
    email: string;
    onClose: () => void;
  }) {
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);
    const [verified, setVerified] = useState(false);
  
    const sendCode = async () => {
      try {
        await api.post(`/api/v1/users/emails/verification-requests?email=${email}`);
        setSent(true);
      } catch (error) {
        console.error('인증 코드 전송 실패:', error);
        alert('인증 코드 전송에 실패했습니다. 다시 시도해주세요.');
      }
    };
  
    const verifyCode = async () => {
        console.log("📩 verifyCode 함수 실행됨");
        try {
        const res = await api.get(`/api/v1/users/emails/verifications`, {
          params: { 
            email: email.trim(), 
            code: code.trim() 
        },
        });

        console.log("응답 데이터 확인:", res.data);

        if (res.data.data === true) {
          setVerified(true);
          alert("이메일 인증 완료!");
          onClose();
        } else {
          alert("인증 코드가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error('인증 코드 확인 실패:', error);
        alert('인증 코드 확인에 실패했습니다. 다시 시도해주세요.');
      }
    };
  
    return (
      <div className="modal">
        {!sent ? (
          <button onClick={sendCode}>인증 코드 전송</button>
        ) : (
          <>
            <input 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="인증 코드 입력"
              type="text"
              maxLength={6}
            />
            <button onClick={verifyCode}>인증</button>
          </>
        )}
      </div>
    );
  }