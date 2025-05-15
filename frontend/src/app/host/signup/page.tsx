'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SignupData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  type: string[];
}

export default function HostRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    type: ['HOST']
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 비밀번호 확인 검증
    if (formData.password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('회원가입 처리 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      router.push('/host/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">회원가입</h1>
        
        {error && (
          <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7047EB] focus:outline-none focus:ring-1 focus:ring-[#7047EB]"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7047EB] focus:outline-none focus:ring-1 focus:ring-[#7047EB]"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              전화번호
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="010-0000-0000"
              pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7047EB] focus:outline-none focus:ring-1 focus:ring-[#7047EB]"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              하이픈(-)을 포함하여 입력해주세요
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7047EB] focus:outline-none focus:ring-1 focus:ring-[#7047EB]"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              8자 이상의 영문, 숫자, 특수문자를 조합해주세요
            </p>
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7047EB] focus:outline-none focus:ring-1 focus:ring-[#7047EB]"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-6">
            <Link
              href="/host"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              뒤로가기
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#7047EB] text-white px-6 py-2 rounded-md hover:bg-[#8561ED] focus:outline-none focus:ring-2 focus:ring-[#7047EB] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리중...' : '가입하기'}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/host/login" className="text-[#7047EB] hover:text-[#8561ED]">
              로그인하기
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
} 