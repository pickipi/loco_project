'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface User {
  isLoggedIn: boolean;
}

export default function HostMainPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로그인 상태 확인
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include' // 쿠키 포함
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setUser({ isLoggedIn: false });
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleRegisterClick = () => {
    if (!user?.isLoggedIn) {
      router.push('/host/login?redirect=/host/space/register');
    } else {
      router.push('/host/space/register');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <div className="absolute inset-0 bg-[#7047EB] opacity-90" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl font-bold mb-6 text-center">
            당신의 공간을 <br className="md:hidden" />
            LOCO와 함께
          </h1>
          <p className="text-xl mb-8 text-center">새로운 호스팅의 시작, LOCO와 함께하세요</p>
          <button
            onClick={handleRegisterClick}
            className="bg-white text-[#7047EB] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            호스트 시작하기
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">LOCO 호스트의 특별한 혜택</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '간편한 공간 등록',
                description: '몇 번의 클릭만으로 당신의 공간을 등록할 수 있습니다.',
                icon: '🏠'
              },
              {
                title: '스마트한 예약 관리',
                description: '실시간 예약 관리와 알림으로 편리하게 관리하세요.',
                icon: '📱'
              },
              {
                title: '안전한 정산 시스템',
                description: '투명하고 안전한 정산으로 신뢰할 수 있는 호스팅',
                icon: '💰'
              },
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '1,000+', label: '등록된 공간' },
              { number: '50,000+', label: '월간 예약' },
              { number: '98%', label: '호스트 만족도' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#7047EB] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#7047EB] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">지금 바로 LOCO 호스트가 되어보세요</h2>
          <p className="text-lg mb-8">
            전문적인 호스트 매니저가 당신의 성공적인 호스팅을 도와드립니다
          </p>
          <Link
            href="/host/signup"
            className="inline-block bg-white text-[#7047EB] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">호스트의 이야기</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "LOCO와 함께하면서 공간 관리가 훨씬 수월해졌어요. 예약부터 정산까지 한 번에 해결할 수 있어서 좋습니다.",
                author: "김서연",
                role: "카페 운영자"
              },
              {
                quote: "처음에는 걱정이 많았는데, LOCO의 호스트 매니저님이 친절하게 도와주셔서 쉽게 시작할 수 있었어요.",
                author: "이준호",
                role: "스튜디오 대표"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gray-50">
                <p className="text-lg mb-4 text-gray-600">"{testimonial.quote}"</p>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
