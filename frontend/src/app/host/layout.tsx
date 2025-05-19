import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import HostHeader from '@/components/header/hostheader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LOCO Host - 공간 호스트를 위한 공간',
  description: '당신의 공간을 LOCO와 함께 공유해보세요',
}

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} min-h-screen`}>
      <HostHeader />
      <div className="pt-16" style={{ backgroundColor: '#2563EB' }}>
        {children}
      </div>
    </div>
  )
} 