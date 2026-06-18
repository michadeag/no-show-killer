import { redirect } from 'next/navigation'
import { getBusinessForSession } from '@/lib/get-business'
import pool from '@/lib/db'
import Link from 'next/link'

export default async function ReportPage() {
  const business = await getBusinessForSession()
  if (!business) redirect('/login')

  const isPro = business.plan === 'pro' || business.plan === 'premium'

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
        <span className="text-6xl">🔒</span>
        <h1 className="text-2xl font-bold text-gray-900">Wochenbericht</h1>
        <p className="text-gray-500 max-w-xs">
          Sieh genau, wie viel Geld du durch Erinnerungen gerettet hast — nur im Pro-Plan verfügbar.
        </p>
        <Link href="/dashboard/billing" className="bg-[#1D9E75] text-white px-6 py-3 rounded-2xl font-bold text-lg">
          Auf Pro upgraden
        </Link>
      </div>
    )
  }

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const [savedResult, noShowResult, totalResult] = await Promise.all([
    pool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(price_value), 0) as revenue
       FROM appointments
       WHERE business_id = $1 AND status IN ('confirmed','completed')
       AND reminder_sent_at IS NOT NULL AND scheduled_at >= $2`,
      [business.id, weekStart]
    ),
    pool.query(
      `SELECT COUNT(*) FROM appointments WHERE business_id = $1 AND status = 'no_show' AND scheduled_at >= $2`,
      [business.id, weekStart]
    ),
    pool.query(
      `SELECT COUNT(*) FROM appointments WHERE business_id = $1 AND scheduled_at >= $2`,
      [business.id, weekStart]
    ),
  ])

  const savedCount = parseInt(savedResult.rows[0].count)
  const savedRevenue = parseFloat(savedResult.rows[0].revenue)
  const noShowCount = parseInt(noShowResult.rows[0].count)
  const totalCount = parseInt(totalResult.rows[0].count)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Wochenbericht</h1>

      <div className="bg-[#1D9E75] rounded-2xl p-6 text-white text-center">
        <p className="text-sm font-medium opacity-80 mb-1">Diese Woche gerettet</p>
        <p className="text-6xl font-bold">{savedRevenue.toFixed(0)} €</p>
        <p className="text-sm opacity-80 mt-2">durch automatische WhatsApp-Erinnerungen</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{savedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Termine durch Erinnerung gesichert</p>
        </div>
        <div className={`bg-white rounded-2xl border shadow-sm p-4 text-center ${noShowCount > 0 ? 'border-[#E24B4A]' : 'border-gray-100'}`}>
          <p className={`text-3xl font-bold ${noShowCount > 0 ? 'text-[#E24B4A]' : 'text-gray-900'}`}>{noShowCount}</p>
          <p className="text-sm text-gray-500 mt-1">Kunden abgesprungen</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center col-span-2">
          <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
          <p className="text-sm text-gray-500 mt-1">Termine diese Woche gesamt</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-500">
        💡 Erinnerungen werden in Phase 2 automatisch 24 Stunden vor dem Termin verschickt. Bis dahin kannst du sie manuell in der Terminliste auslösen.
      </div>
    </div>
  )
}
