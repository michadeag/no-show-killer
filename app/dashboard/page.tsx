import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getBusinessForSession } from '@/lib/get-business'
import pool from '@/lib/db'
import StatusBadge from '@/components/StatusBadge'
import { AppointmentStatus } from '@/lib/mock-data'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

export default async function DashboardPage() {
  const business = await getBusinessForSession()
  if (!business) redirect('/login')

  const now = new Date()
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999)
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0)

  const [todayResult, noShowResult, savedResult, upcomingResult] = await Promise.all([
    pool.query(
      `SELECT COUNT(*) FROM appointments WHERE business_id = $1 AND scheduled_at BETWEEN $2 AND $3`,
      [business.id, todayStart, todayEnd]
    ),
    pool.query(
      `SELECT COUNT(*) FROM appointments WHERE business_id = $1 AND status = 'no_show' AND scheduled_at >= $2`,
      [business.id, weekStart]
    ),
    pool.query(
      `SELECT COALESCE(SUM(price_value), 0) as total FROM appointments
       WHERE business_id = $1 AND status IN ('confirmed','completed') AND reminder_sent_at IS NOT NULL AND scheduled_at >= $2`,
      [business.id, weekStart]
    ),
    pool.query(
      `SELECT a.*, c.full_name as customer_name FROM appointments a
       JOIN customers c ON c.id = a.customer_id
       WHERE a.business_id = $1 AND a.scheduled_at >= NOW()
       ORDER BY a.scheduled_at ASC LIMIT 5`,
      [business.id]
    ),
  ])

  const todayCount = parseInt(todayResult.rows[0].count)
  const noShowCount = parseInt(noShowResult.rows[0].count)
  const savedRevenue = parseFloat(savedResult.rows[0].total)
  const upcoming = upcomingResult.rows
  const isPro = business.plan === 'pro' || business.plan === 'premium'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Übersicht</h1>

      {/* KPI-Karten */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-500">Termine heute</span>
          <span className="text-5xl font-bold text-gray-900">{todayCount}</span>
          <Link href="/dashboard/appointments" className="text-sm text-[#1D9E75] font-medium mt-1">
            Alle ansehen →
          </Link>
        </div>

        <div className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-1 ${noShowCount > 0 ? 'border-[#E24B4A]' : 'border-gray-100'}`}>
          <span className="text-sm font-medium text-gray-500">Kunden abgesprungen (Woche)</span>
          <span className={`text-5xl font-bold ${noShowCount > 0 ? 'text-[#E24B4A]' : 'text-gray-900'}`}>{noShowCount}</span>
          {noShowCount > 0 && <span className="text-xs text-[#E24B4A] font-medium">Warteliste prüfen!</span>}
        </div>

        {isPro ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#1D9E75] p-5 flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">Geretteter Umsatz (Woche)</span>
            <span className="text-5xl font-bold text-[#1D9E75]">{savedRevenue.toFixed(0)} €</span>
            <span className="text-xs text-gray-400 font-medium">durch Erinnerungen gespart</span>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-400">Geretteter Umsatz</span>
            <span className="text-5xl font-bold text-gray-300">—</span>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-lg">🔒</span>
              <Link href="/dashboard/billing" className="text-xs text-gray-400">Upgrade zu Pro</Link>
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
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="font-medium">Noch keine Termine eingetragen</p>
            <Link href="/dashboard/appointments/new" className="mt-3 inline-block text-sm text-[#1D9E75] font-medium">
              Ersten Termin anlegen →
            </Link>
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
                  <StatusBadge status={apt.status as AppointmentStatus} />
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
