'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaApple, FaCheck } from 'react-icons/fa';
import { SiNaver, SiKakaotalk } from 'react-icons/si';
import { useRouter, useSearchParams } from 'next/navigation';
import EmailVerificationButton from '@/components/emailverification/EmailVerificationButton';

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const alertMsg = params.get("msg");
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

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
    setError("");

    // 클라이언트 측 유효성 검사
    if (!isEmailVerified) {
      alert('이메일 인증이 필요합니다.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreements.terms || !agreements.privacy || !agreements.age) {
      alert('필수 약관에 동의해야 합니다.');
      return;
    }
    
    console.log('회원가입 시도:', { formData, agreements });

    try {
      const response = await fetch('http://localhost:8090/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          userType: 'GUEST'
        }),
      });

      if (response.ok) {
        alert('회원가입 성공!');
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      setError('회원가입 중 오류가 발생했습니다.');
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <EmailVerificationButton 
                  email={formData.email}
                  onChange={(email) => setFormData(prev => ({ ...prev, email }))}
                  onVerified={() => setIsEmailVerified(true)}
                />
                {isEmailVerified && (
                  <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <FaCheck size={12} />
                    이메일이 인증되었습니다.
                  </p>
                )}
              </div>
              
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="sr-only">전화번호</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="전화번호"
                  pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  하이픈(-)을 포함하여 입력해주세요 (예: 010-1234-5678)
                </p>
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
              
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? '처리중...' : '회원가입'}
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