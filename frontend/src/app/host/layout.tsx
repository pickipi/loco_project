'use client'

import { Inter } from 'next/font/google'
import HostHeader from '@/components/header/hostheader'
import { ThemeProvider } from '@/components/darkmode/ThemeContext'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isMainPage = pathname === '/host'

  return (
    <ThemeProvider>
      <div className={inter.className} style={{ 
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        color: 'var(--text-primary)'
      }}>
        <HostHeader />
        <main style={{ 
          paddingTop: '64px',
          backgroundColor: 'var(--bg-primary)',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{
            maxWidth: isMainPage ? '100%' : '1200px',
            margin: '0 auto',
            padding: isMainPage ? '0' : '24px'
          }}>
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
} 