'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewAppointmentPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    phone_number: '',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: '45',
    price_value: '65',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Phase 1: nur Demo — in Phase 2 wird hier ein API-Call gemacht
    console.log('[Demo] Neuer Termin:', form)
    setSaved(true)
    setTimeout(() => router.push('/dashboard/appointments'), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-700 text-xl">←</button>
        <h1 className="text-2xl font-bold text-gray-900">Neuer Termin</h1>
      </div>

      {saved && (
        <div className="bg-[#1D9E75] text-white px-4 py-3 rounded-xl font-medium">
          Termin gespeichert ✓ — Weiterleitung...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Kunde</h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name des Kunden</label>
            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              required
              placeholder="z.B. Maria Müller"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp-Nummer</label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
              placeholder="+49 151 1234567"
              type="tel"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Termin</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Datum</label>
              <input
                name="scheduled_date"
                value={form.scheduled_date}
                onChange={handleChange}
                required
                type="date"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Uhrzeit</label>
              <input
                name="scheduled_time"
                value={form.scheduled_time}
                onChange={handleChange}
                required
                type="time"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Dauer</label>
            <select
              name="duration_minutes"
              value={form.duration_minutes}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            >
              <option value="30">30 Minuten</option>
              <option value="45">45 Minuten</option>
              <option value="60">60 Minuten</option>
              <option value="90">90 Minuten</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Preis (€)</label>
            <input
              name="price_value"
              value={form.price_value}
              onChange={handleChange}
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="65"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#1D9E75] text-white text-lg font-bold rounded-2xl hover:bg-[#178a64] transition-colors"
        >
          Termin speichern
        </button>
      </form>
    </div>
  )
}
