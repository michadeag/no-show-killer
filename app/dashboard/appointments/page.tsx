'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import { AppointmentStatus } from '@/lib/mock-data'

type Appointment = {
  id: string
  customer_name: string
  phone_number: string
  scheduled_at: string
  duration_minutes: number
  price_value: number
  status: AppointmentStatus
}

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
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/appointments')
      .then(r => r.json())
      .then(data => { setAppointments(data); setLoading(false) })
  }, [])

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  async function handleAction(action: string, id: string, name: string) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    if (!res.ok) return

    const msgs: Record<string, string> = {
      remind: `Erinnerung an ${name} gesendet ✓`,
      confirm: `${name} als bestätigt markiert ✓`,
      no_show: `${name} als No-Show markiert. Warteliste wird kontaktiert...`,
    }
    setToast(msgs[action])
    setTimeout(() => setToast(null), 3000)

    // Status lokal aktualisieren
    const newStatus: Record<string, AppointmentStatus> = {
      remind: 'reminded', confirm: 'confirmed', no_show: 'no_show',
    }
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus[action] ?? a.status } : a)
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Termine</h1>
        <Link href="/dashboard/appointments/new" className="bg-[#1D9E75] text-white px-4 py-2 rounded-xl font-medium text-sm">
          + Neuer Termin
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {toast && (
        <div className="bg-[#1D9E75] text-white px-4 py-3 rounded-xl text-sm font-medium">{toast}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Lade Termine...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>Keine Termine gefunden</p>
          <Link href="/dashboard/appointments/new" className="mt-3 inline-block text-sm text-[#1D9E75] font-medium">
            Ersten Termin anlegen →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{apt.customer_name}</p>
                  <p className="text-sm text-gray-500">{apt.phone_number}</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {formatDateTime(apt.scheduled_at)} · {apt.duration_minutes} Min · {apt.price_value} €
                  </p>
                </div>
                <StatusBadge status={apt.status} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {apt.status === 'scheduled' && (
                  <button
                    onClick={() => handleAction('remind', apt.id, apt.customer_name)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100"
                  >
                    📱 Erinnerung senden
                  </button>
                )}
                {apt.status === 'reminded' && (
                  <button
                    onClick={() => handleAction('confirm', apt.id, apt.customer_name)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-[#1D9E75] font-medium hover:bg-green-100"
                  >
                    ✓ Als bestätigt markieren
                  </button>
                )}
                {(apt.status === 'scheduled' || apt.status === 'reminded') && (
                  <button
                    onClick={() => handleAction('no_show', apt.id, apt.customer_name)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-[#E24B4A] font-medium hover:bg-red-100"
                  >
                    ✗ No-Show
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
