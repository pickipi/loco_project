'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // TODO: 실제 로그인 로직 구현
      console.log('Login attempt:', { email, password })
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">로그인</h1>
        
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7047EB] focus:outline-none focus:ring-1 focus:ring-[#7047EB]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7047EB] focus:outline-none focus:ring-1 focus:ring-[#7047EB]"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#7047EB] focus:ring-[#7047EB]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                로그인 상태 유지
              </label>
            </div>

            <div className="text-sm">
              <Link href="/host/forgot-password" className="text-[#7047EB] hover:text-[#8561ED]">
                비밀번호 찾기
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7047EB] text-white px-6 py-2 rounded-md hover:bg-[#8561ED] focus:outline-none focus:ring-2 focus:ring-[#7047EB] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link href="/host/signup" className="text-[#7047EB] hover:text-[#8561ED]">
              회원가입하기
            </Link>
          </div>
        </form>

        {/* 소셜 로그인 */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsLoading(true)
                // TODO: Google 로그인 구현
              }}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7047EB] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                className="h-5 w-5"
                src="https://www.svgrepo.com/show/475647/google-color.svg"
                alt="Google logo"
              />
              Google로 계속하기
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true)
                // TODO: Kakao 로그인 구현
              }}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7047EB] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                className="h-5 w-5"
                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
                alt="Kakao logo"
              />
              카카오로 계속하기
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
