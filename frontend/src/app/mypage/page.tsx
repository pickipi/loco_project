'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header/header';

export default function Mypage() {
  const [realName, setRealName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isKakaoLinked, setIsKakaoLinked] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRealName = localStorage.getItem('realName');
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');
      const storedPhone = localStorage.getItem('phoneNumber');

      if (storedRealName) setRealName(storedRealName);
      if (storedUsername) setUsername(storedUsername);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhone) setPhone(storedPhone);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* <h1 className="text-2xl font-bold text-gray-900 mb-8">프로필 관리</h1> */}

        <div className="flex flex-col md:flex-row rounded-xl overflow-hidden bg-white">
          {/* Left - 프로필 이미지 */}
          <div className="w-full md:w-1/3 bg-white px-6 py-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <div className="w-28 h-28 rounded-full bg-gray-200 text-white flex items-center justify-center text-4xl font-bold mb-3">
              {(realName || username)?.charAt(0).toUpperCase() || ''}
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg text-gray-800">{realName || username}</p>
              <button className="text-sm text-blue-600 hover:underline mt-1">프로필 사진 변경</button>
            </div>
          </div>

          {/* Right - 정보 목록 */}
          <div className="w-full md:w-2/3 px-6 py-8 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">닉네임</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{realName || username}</span>
                <button className="text-sm text-blue-600 hover:underline">변경하기</button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">이메일</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{email}</span>
                <button className="text-sm text-blue-600 hover:underline">인증하기</button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">연락처</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{phone}</span>
                <button className="text-sm text-blue-600 hover:underline">변경하기</button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">SNS 연동</span>
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-sm">카카오 연동</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" checked={isKakaoLinked} readOnly />
                  <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${isKakaoLinked ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isKakaoLinked ? 'translate-x-5' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">비밀번호</span>
              <button className="text-sm text-blue-600 hover:underline">비밀번호 변경</button>
            </div>

            <div className="pt-6 text-center border-t border-gray-100">
              <button className="text-sm text-gray-500 hover:underline">서비스 탈퇴하기</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="text-center text-sm text-gray-400">
          © 2025 LoCo Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}