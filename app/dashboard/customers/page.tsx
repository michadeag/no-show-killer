import { redirect } from 'next/navigation'
import { getBusinessForSession } from '@/lib/get-business'
import pool from '@/lib/db'

export default async function CustomersPage() {
  const business = await getBusinessForSession()
  if (!business) redirect('/login')

  const result = await pool.query(
    `SELECT c.*,
       COUNT(a.id) as appointment_count,
       MAX(a.scheduled_at) as last_visit
     FROM customers c
     LEFT JOIN appointments a ON a.customer_id = c.id
     WHERE c.business_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [business.id]
  )

  const customers = result.rows

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kunden</h1>
        <span className="text-sm text-gray-500">{customers.length} Kunden</span>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p>Noch keine Kunden — werden automatisch beim Anlegen von Terminen erstellt</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#1D9E75] text-white flex items-center justify-center text-lg font-bold shrink-0">
                {c.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{c.full_name}</p>
                <p className="text-sm text-gray-500">{c.phone_number}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-700">{c.appointment_count} Termine</p>
                {c.last_visit && (
                  <p className="text-xs text-gray-400">
                    {new Date(c.last_visit).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
