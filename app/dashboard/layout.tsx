'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOCK_BUSINESS } from '@/lib/mock-data'

const navItems = [
  { href: '/dashboard', label: '🏠 Übersicht', exact: true },
  { href: '/dashboard/appointments', label: '📅 Termine' },
  { href: '/dashboard/customers', label: '👥 Kunden' },
  { href: '/dashboard/report', label: '📊 Bericht' },
  { href: '/dashboard/billing', label: '💳 Abo' },
  { href: '/dashboard/booking-settings', label: '🔗 Buchung' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top-Nav */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <span className="text-lg font-bold text-gray-900">No-Show-Killer</span>
          <span className="ml-2 text-sm text-gray-400">{MOCK_BUSINESS.name}</span>
        </div>
        <span className="text-xs bg-[#1D9E75] text-white px-2 py-1 rounded-full font-semibold uppercase">
          {MOCK_BUSINESS.plan}
        </span>
      </header>

      {/* Haupt-Content */}
      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom-Navigation (Mobile-first) */}
      <nav className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="flex justify-around max-w-2xl mx-auto">
          {navItems.map(({ href, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors ${
                  active ? 'text-[#1D9E75]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-xl leading-none mb-1">{label.split(' ')[0]}</span>
                <span>{label.split(' ').slice(1).join(' ')}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
