import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import pool from '@/lib/db'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.email !== process.env.ADMIN_EMAIL) redirect('/')

  const businesses = await pool.query(`
    SELECT
      b.id, b.name, b.owner_email, b.plan,
      b.subscription_status, b.created_at,
      b.current_period_end,
      COUNT(a.id) as appointment_count,
      COALESCE(SUM(i.amount_cents) FILTER (WHERE i.status = 'paid'), 0) as total_revenue_cents
    FROM businesses b
    LEFT JOIN appointments a ON a.business_id = b.id
    LEFT JOIN invoices i ON i.business_id = b.id
    GROUP BY b.id
    ORDER BY b.created_at DESC
  `)

  const stats = await pool.query(`
    SELECT
      COUNT(*) as total_businesses,
      COUNT(*) FILTER (WHERE subscription_status = 'active') as active,
      COUNT(*) FILTER (WHERE subscription_status = 'past_due') as past_due,
      COUNT(*) FILTER (WHERE subscription_status = 'cancelled') as cancelled
    FROM businesses
  `)

  const s = stats.rows[0]

  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    past_due: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
    inactive: 'bg-yellow-100 text-yellow-700',
  }

  const planColor: Record<string, string> = {
    basis: 'bg-gray-100 text-gray-600',
    pro: 'bg-blue-100 text-blue-700',
    premium: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin — No-Show-Killer</h1>
          <Link href="/admin/settings" className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 font-medium">
            ⚙️ Einstellungen
          </Link>
        </div>

        {/* KPI-Karten */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Kunden gesamt', value: s.total_businesses },
            { label: 'Aktive Abos', value: s.active, green: true },
            { label: 'Zahlung überfällig', value: s.past_due, red: true },
            { label: 'Gekündigt', value: s.cancelled },
          ].map(({ label, value, green, red }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className={`text-3xl font-bold ${green ? 'text-[#1D9E75]' : red ? 'text-[#E24B4A]' : 'text-gray-900'}`}>
                {value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Kundentabelle */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Alle Kunden ({businesses.rows.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Praxis</th>
                  <th className="px-4 py-3 text-left">E-Mail</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Termine</th>
                  <th className="px-4 py-3 text-right">Umsatz</th>
                  <th className="px-4 py-3 text-left">Dabei seit</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {businesses.rows.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                    <td className="px-4 py-3 text-gray-500">{b.owner_email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planColor[b.plan] ?? ''}`}>
                        {b.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[b.subscription_status] ?? ''}`}>
                        {b.subscription_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{b.appointment_count}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#1D9E75]">
                      {(b.total_revenue_cents / 100).toFixed(0)} €
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(b.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/businesses/${b.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                      >
                        Bearbeiten
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
