import Link from 'next/link'
import { getMockStats, getUpcomingAppointments, MOCK_BUSINESS } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

export default function DashboardPage() {
  const { todayCount, noShowThisWeek, savedThisWeek } = getMockStats()
  const upcoming = getUpcomingAppointments(5)
  const isPro = MOCK_BUSINESS.plan === 'pro' || MOCK_BUSINESS.plan === 'premium'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Übersicht</h1>

      {/* KPI-Karten */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Karte 1: Termine heute */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-500">Termine heute</span>
          <span className="text-5xl font-bold text-gray-900">{todayCount}</span>
          <Link href="/dashboard/appointments" className="text-sm text-[#1D9E75] font-medium mt-1">
            Alle ansehen →
          </Link>
        </div>

        {/* Karte 2: No-Shows diese Woche */}
        <div className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-1 ${
          noShowThisWeek > 0 ? 'border-[#E24B4A]' : 'border-gray-100'
        }`}>
          <span className="text-sm font-medium text-gray-500">Kunden abgesprungen (Woche)</span>
          <span className={`text-5xl font-bold ${noShowThisWeek > 0 ? 'text-[#E24B4A]' : 'text-gray-900'}`}>
            {noShowThisWeek}
          </span>
          {noShowThisWeek > 0 && (
            <span className="text-xs text-[#E24B4A] font-medium">Warteliste prüfen!</span>
          )}
        </div>

        {/* Karte 3: Geretteter Umsatz */}
        {isPro ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#1D9E75] p-5 flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">Geretteter Umsatz (Woche)</span>
            <span className="text-5xl font-bold text-[#1D9E75]">
              {savedThisWeek.toFixed(0)} €
            </span>
            <span className="text-xs text-gray-400 font-medium">durch Erinnerungen gespart</span>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col gap-1 relative overflow-hidden">
            <span className="text-sm font-medium text-gray-400">Geretteter Umsatz</span>
            <span className="text-5xl font-bold text-gray-300">—</span>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-lg">🔒</span>
              <span className="text-xs text-gray-400">
                Upgrade zu Pro um zu sehen, wie viel du sparst
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nächste Termine */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Nächste Termine</h2>
          <Link href="/dashboard/appointments/new" className="text-sm bg-[#1D9E75] text-white px-3 py-1.5 rounded-lg font-medium">
            + Neuer Termin
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400">
            Keine anstehenden Termine
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{apt.customer_name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(apt.scheduled_at)} · {formatTime(apt.scheduled_at)} · {apt.duration_minutes} Min
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusBadge status={apt.status} />
                  <span className="text-sm font-semibold text-gray-700">{apt.price_value} €</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
