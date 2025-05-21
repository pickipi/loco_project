'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaApple, FaCheck } from 'react-icons/fa';
import { SiNaver, SiKakaotalk } from 'react-icons/si';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    age: false,
    sms: false,
    email: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name === 'all') {
      setAgreements({
        all: checked,
        terms: checked,
        privacy: checked,
        age: checked,
        sms: checked,
        email: checked,
      });
    } else {
      const newAgreements = {
        ...agreements,
        [name]: checked,
      };
      
      // 모든 약관에 동의했는지 확인
      const allChecked = 
        newAgreements.terms && 
        newAgreements.privacy && 
        newAgreements.age && 
        newAgreements.sms && 
        newAgreements.email;
      
      setAgreements({
        ...newAgreements,
        all: allChecked,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 측 유효성 검사 (예시)
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!agreements.terms || !agreements.privacy || !agreements.age) {
        alert('필수 약관에 동의해야 합니다.');
        return;
    }
    
    console.log('회원가입 시도:', { formData, agreements });

    try {
        // TODO: 실제 백엔드 회원가입 API 엔드포인트로 변경 (수정됨: /api/v1/users)
        const response = await fetch('/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.name,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                // 약관 동의 정보 필요 시 추가
                agreements: {
                    sms: agreements.sms,
                    email: agreements.email,
                }
            }),
        });

        if (response.ok) {
            // 회원가입 성공 시 처리 (예: 성공 메시지 표시 또는 로그인 페이지로 이동)
            alert('회원가입 성공!');
            // TODO: 로그인 페이지 또는 메인 페이지로 리다이렉트
            // router.push('/login'); 
        } else {
            // 회원가입 실패 시 처리 (예: 에러 메시지 표시)
            const errorData = await response.json();
            alert(`회원가입 실패: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-4 border-b border-gray-100">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-7xl flex justify-center">
          <Link href="/" className="font-bold text-2xl md:text-3xl">
            LoCo
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">회원가입</h1>
          
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full py-3 px-4 flex items-center justify-center bg-[#03C75A] text-white rounded-md hover:bg-opacity-90">
              <SiNaver className="mr-2" size={20} />
              네이버로 로그인
            </button>
            <button className="w-full py-3 px-4 flex items-center justify-center bg-[#FEE500] text-black rounded-md hover:bg-opacity-90">
              <SiKakaotalk className="mr-2" size={20} />
              카카오로 로그인
            </button>
            <button className="w-full py-3 px-4 flex items-center justify-center bg-black text-white rounded-md hover:bg-opacity-90">
              <FaApple className="mr-2" size={20} />
              Apple로 로그인
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-gray-500 text-sm">또는</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
          
          {/* Email Signup Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="sr-only">이름</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="이름"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">이메일</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="sr-only">전화번호</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="전화번호 (- 없이 입력)"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="sr-only">비밀번호</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  - 문자/숫자/특수문자 중 2가지 이상 조합 (8~30자)<br />
                  - 3개 이상 키보드 상 배열이 연속되거나 동일한 문자/숫자 제외
                </p>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="sr-only">비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호 확인"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Agreements */}
              <div className="pt-4">
                <div className="flex items-center mb-4">
                  <input
                    id="agreement-all"
                    name="all"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={agreements.all}
                    onChange={handleAgreementChange}
                  />
                  <label htmlFor="agreement-all" className="ml-2 block text-sm font-medium text-gray-700">
                    아래 약관에 모두 동의합니다.
                  </label>
                </div>
                
                <div className="ml-6 space-y-3">
                  <div className="flex items-center">
                    <input
                      id="agreement-terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={agreements.terms}
                      onChange={handleAgreementChange}
                      required
                    />
                    <label htmlFor="agreement-terms" className="ml-2 block text-sm text-gray-700">
                      서비스 이용약관 (필수)
                    </label>
                    <button type="button" className="ml-auto text-xs text-gray-500 hover:text-gray-700">
                      보기
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="agreement-privacy"
                      name="privacy"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={agreements.privacy}
                      onChange={handleAgreementChange}
                      required
                    />
                    <label htmlFor="agreement-privacy" className="ml-2 block text-sm text-gray-700">
                      개인정보 수집 및 이용 (필수)
                    </label>
                    <button type="button" className="ml-auto text-xs text-gray-500 hover:text-gray-700">
                      보기
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="agreement-age"
                      name="age"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={agreements.age}
                      onChange={handleAgreementChange}
                      required
                    />
                    <label htmlFor="agreement-age" className="ml-2 block text-sm text-gray-700">
                      본인은 만 14세 이상입니다. (필수)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="agreement-sms"
                      name="sms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={agreements.sms}
                      onChange={handleAgreementChange}
                    />
                    <label htmlFor="agreement-sms" className="ml-2 block text-sm text-gray-700">
                      이벤트 등 프로모션 알림 SMS 수신 (선택)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="agreement-email"
                      name="email"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={agreements.email}
                      onChange={handleAgreementChange}
                    />
                    <label htmlFor="agreement-email" className="ml-2 block text-sm text-gray-700">
                      이벤트 등 프로모션 알림 메일 수신 (선택)
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  회원가입
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100">
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">© 2025 LoCo Inc. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">이용약관</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">개인정보처리방침</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">운영정책</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">고객 문의</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 