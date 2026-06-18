'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MOCK_APPOINTMENTS, AppointmentStatus } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'

const statusLabels: Record<string, string> = {
  all: 'Alle',
  scheduled: 'Geplant',
  reminded: 'Erinnert',
  confirmed: 'Bestätigt',
  no_show: 'No-Show',
  completed: 'Abgeschlossen',
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('de-DE', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<string>('all')
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = filter === 'all'
    ? [...MOCK_APPOINTMENTS].sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    : MOCK_APPOINTMENTS.filter((a) => a.status === filter)
        .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())

  function handleAction(action: string, name: string, phone: string) {
    const msgs: Record<string, string> = {
      remind: `WhatsApp-Erinnerung an ${name} (${phone}) gesendet ✓`,
      confirm: `${name} als bestätigt markiert ✓`,
      noshow: `${name} als No-Show markiert. Warteliste wird kontaktiert...`,
    }
    setActionMsg(msgs[action] ?? '')
    setTimeout(() => setActionMsg(null), 3000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Termine</h1>
        <Link
          href="/dashboard/appointments/new"
          className="bg-[#1D9E75] text-white px-4 py-2 rounded-xl font-medium text-sm"
        >
          + Neuer Termin
        </Link>
      </div>

      {/* Filter-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Aktions-Toast */}
      {actionMsg && (
        <div className="bg-[#1D9E75] text-white px-4 py-3 rounded-xl text-sm font-medium">
          {actionMsg}
        </div>
      )}

      {/* Terminliste */}
      <div className="space-y-3">
        {filtered.map((apt) => (
          <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold text-gray-900">{apt.customer_name}</p>
                <p className="text-sm text-gray-500">{apt.phone_number}</p>
                <p className="text-sm text-gray-600 mt-0.5">{formatDateTime(apt.scheduled_at)} · {apt.duration_minutes} Min · {apt.price_value} €</p>
              </div>
              <StatusBadge status={apt.status} />
            </div>

            {/* Aktions-Buttons */}
            <div className="flex gap-2 flex-wrap">
              {(apt.status === 'scheduled') && (
                <button
                  onClick={() => handleAction('remind', apt.customer_name, apt.phone_number)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100"
                >
                  📱 Erinnerung senden
                </button>
              )}
              {(apt.status === 'reminded') && (
                <button
                  onClick={() => handleAction('confirm', apt.customer_name, apt.phone_number)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-[#1D9E75] font-medium hover:bg-green-100"
                >
                  ✓ Als bestätigt markieren
                </button>
              )}
              {(apt.status === 'scheduled' || apt.status === 'reminded') && (
                <button
                  onClick={() => handleAction('noshow', apt.customer_name, apt.phone_number)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-[#E24B4A] font-medium hover:bg-red-100"
                >
                  ✗ No-Show
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
