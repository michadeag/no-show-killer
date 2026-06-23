'use client'
import { use, useState, useEffect } from 'react'

type Params = Promise<{ slug: string }>

const WEEKDAY_NAMES = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function BookingPage({ params }: { params: Params }) {
  const { slug } = use(params)

  const [business, setBusiness]     = useState<any>(null)
  const [notFound, setNotFound]     = useState(false)
  const [selectedDate, setDate]     = useState<string | null>(null)
  const [slots, setSlots]           = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSlot]     = useState<string | null>(null)
  const [name, setName]             = useState('')
  const [phone, setPhone]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/book/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setBusiness(d); else setNotFound(true) })
  }, [slug])

  useEffect(() => {
    if (!selectedDate) { setSlots([]); setSlot(null); return }
    setLoadingSlots(true)
    fetch(`/api/book/${slug}/slots?date=${selectedDate}`)
      .then(r => r.json())
      .then(d => { setSlots(d.slots || []); setSlot(null); setLoadingSlots(false) })
  }, [selectedDate, slug])

  async function submit() {
    if (!selectedDate || !selectedSlot || !name || !phone) return
    setSubmitting(true)
    setError(null)
    const res = await fetch(`/api/book/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate, time: selectedSlot, name, phone }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) { setError(data.error || 'Fehler'); return }
    setDone(true)
  }

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500">
        <p className="text-4xl mb-3">😕</p>
        <p className="font-semibold text-gray-700">Buchungsseite nicht gefunden</p>
      </div>
    </div>
  )

  if (!business) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!business.active) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center text-gray-500 max-w-xs">
        <p className="text-4xl mb-3">📅</p>
        <p className="font-semibold text-gray-700 text-lg mb-2">{business.name}</p>
        <p>Online-Buchung ist aktuell nicht verfügbar. Bitte ruf uns direkt an.</p>
        {business.phone && <a href={`tel:${business.phone}`} className="mt-4 inline-block text-[#1D9E75] font-semibold">{business.phone}</a>}
      </div>
    </div>
  )

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Termin bestätigt!</h2>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">{selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
          {' um '}<span className="font-semibold">{selectedSlot} Uhr</span>
        </p>
        <p className="text-gray-500 text-sm mt-3">Du erhältst eine Bestätigung per WhatsApp.</p>
      </div>
    </div>
  )

  // Build date options
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dates: Date[] = []
  for (let i = 0; i < (business.max_days_ahead || 30); i++) {
    dates.push(addDays(today, i))
  }

  // Group dates by week for display
  const dateStr = (d: Date) => toDateStr(d)
  const jsDay = (d: Date) => d.getDay() // 0=Sun
  const monIdx = (d: Date) => jsDay(d) === 0 ? 6 : jsDay(d) - 1

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Online-Termin buchen</p>
        </div>

        {/* Step 1: Date */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">1. Datum wählen</h2>
          </div>
          <div className="px-5 py-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAY_NAMES.map(d => (
                <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
              ))}
            </div>
            {/* Mini calendar grid */}
            {(() => {
              const first = dates[0]
              const offset = monIdx(first)
              const allCells: (Date | null)[] = [...Array(offset).fill(null), ...dates]
              const rows: (Date | null)[][] = []
              for (let i = 0; i < allCells.length; i += 7) rows.push(allCells.slice(i, i + 7))
              return rows.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7 gap-1 mb-1">
                  {row.map((d, ci) => d ? (
                    <button key={ci}
                      onClick={() => setDate(dateStr(d))}
                      className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                        dateStr(d) === selectedDate
                          ? 'bg-[#1D9E75] text-white'
                          : dateStr(d) === toDateStr(today)
                          ? 'border-2 border-[#1D9E75] text-[#1D9E75]'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}>
                      {d.getDate()}
                    </button>
                  ) : <div key={ci} />)}
                </div>
              ))
            })()}
            {selectedDate && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Time */}
        {selectedDate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">2. Uhrzeit wählen</h2>
            </div>
            <div className="px-5 py-4">
              {loadingSlots ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-3 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : slots.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Keine freien Termine an diesem Tag.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(slot => (
                    <button key={slot}
                      onClick={() => setSlot(slot)}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        slot === selectedSlot
                          ? 'bg-[#1D9E75] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}>
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {selectedSlot && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">3. Deine Daten</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Dein Name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Handynummer (für WhatsApp-Bestätigung) *</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+49 151 23456789"
                  type="tel"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={submit}
                disabled={submitting || !name || !phone}
                className="w-full py-3.5 bg-[#1D9E75] text-white font-bold rounded-xl hover:bg-[#178a63] disabled:opacity-50 transition-colors">
                {submitting ? 'Wird gebucht…' : 'Termin buchen'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Du erhältst eine Bestätigung per WhatsApp an deine Handynummer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
