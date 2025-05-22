'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { hostApi } from '@/services/api'

export default function HostRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountUser: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // JWT 토큰에서 userId 추출
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('로그인이 필요합니다.')
      }

      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      const payload = JSON.parse(jsonPayload)
      const userId = payload.sub.split('@')[0] // 이메일에서 userId 추출

      // 호스트 등록 API 호출
      await hostApi.register(Number(userId), {
        ...formData,
        verified: false, // 초기에는 인증되지 않은 상태
      })

      alert('호스트 등록이 완료되었습니다.')
      router.push('/host/dashboard')
    } catch (error) {
      console.error('호스트 등록 오류:', error)
      setError('호스트 등록 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          호스트 등록
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
              은행 이름
            </label>
            <input
              type="text"
              id="bankName"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
              계좌 번호
            </label>
            <input
              type="text"
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="accountUser" className="block text-sm font-medium text-gray-700">
              예금주
            </label>
            <input
              type="text"
              id="accountUser"
              value={formData.accountUser}
              onChange={(e) => setFormData({ ...formData, accountUser: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {isLoading ? '등록 중...' : '호스트 등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
} 