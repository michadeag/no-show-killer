import { MOCK_APPOINTMENTS } from '@/lib/mock-data'

// Kunden aus Demo-Terminen ableiten (dedupliziert)
function getMockCustomers() {
  const seen = new Set<string>()
  return MOCK_APPOINTMENTS.filter((a) => {
    if (seen.has(a.customer_name)) return false
    seen.add(a.customer_name)
    return true
  }).map((a) => ({
    name: a.customer_name,
    phone: a.phone_number,
    lastVisit: a.scheduled_at,
    totalAppointments: MOCK_APPOINTMENTS.filter((b) => b.customer_name === a.customer_name).length,
  }))
}

export default function CustomersPage() {
  const customers = getMockCustomers()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kunden</h1>
        <span className="text-sm text-gray-500">{customers.length} Kunden</span>
      </div>

      <div className="space-y-3">
        {customers.map((c) => (
          <div key={c.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#1D9E75] text-white flex items-center justify-center text-lg font-bold shrink-0">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{c.name}</p>
              <p className="text-sm text-gray-500">{c.phone}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-700">{c.totalAppointments} Termine</p>
              <p className="text-xs text-gray-400">
                {new Date(c.lastVisit).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
