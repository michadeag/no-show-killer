'use client'
import { useState, useEffect } from 'react'

const WEEKDAY_LABELS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']

interface Weekday {
  weekday: number
  is_open: boolean
  open_time: string
  close_time: string
  break_start: string | null
  break_end: string | null
}

interface Settings {
  business_id: string
  slot_duration_minutes: number
  min_advance_hours: number
  max_days_ahead: number
  booking_active: boolean
  weekdays: Weekday[]
}

export default function BookingSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [bookingUrl, setBookingUrl] = useState('')

  useEffect(() => {
    fetch('/api/booking-settings')
      .then(r => r.json())
      .then(d => {
        const wds = [0,1,2,3,4,5,6].map(i => {
          return d.weekdays.find((w: Weekday) => w.weekday === i) || {
            weekday: i, is_open: i < 5,
            open_time: '09:00', close_time: '18:00',
            break_start: null, break_end: null,
          }
        })
        setSettings({ ...d, weekdays: wds })
        setBookingUrl(`${window.location.origin}/book/${d.business_id}`)
      })
  }, [])

  function updateWd(idx: number, key: keyof Weekday, value: any) {
    if (!settings) return
    const wds = settings.weekdays.map((w, i) => i === idx ? { ...w, [key]: value } : w)
    setSettings({ ...settings, weekdays: wds })
  }

  async function save() {
    if (!settings) return
    setSaving(true)
    await fetch('/api/booking-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const INPUT = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]'

  if (!settings) return <div className="text-center py-12 text-gray-400">Lädt…</div>

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Online-Buchung</h1>
        <button onClick={save} disabled={saving}
          className="px-5 py-2 bg-[#1D9E75] text-white font-semibold rounded-xl text-sm hover:bg-[#178a63] disabled:opacity-60">
          {saving ? 'Speichert…' : saved ? '✓ Gespeichert' : 'Speichern'}
        </button>
      </div>

      {/* Booking URL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Buchungs-Link</h2>
        <div className="flex items-center gap-2">
          <input readOnly value={bookingUrl}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 bg-gray-50" />
          <button onClick={() => navigator.clipboard.writeText(bookingUrl)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">
            Kopieren
          </button>
          <a href={bookingUrl} target="_blank" rel="noopener"
            className="px-3 py-2.5 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-700 whitespace-nowrap">
            Öffnen
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-2">Diesen Link kannst du auf deiner Website oder in Social Media teilen.</p>
      </div>

      {/* General settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Allgemeine Einstellungen</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Online-Buchung aktiv</p>
              <p className="text-xs text-gray-400">Kunden können Termine buchen</p>
            </div>
            <button
              onClick={() => setSettings(s => s ? { ...s, booking_active: !s.booking_active } : s)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.booking_active ? 'bg-[#1D9E75]' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.booking_active ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Slot-Dauer (Min.)</label>
              <select value={settings.slot_duration_minutes}
                onChange={e => setSettings(s => s ? { ...s, slot_duration_minutes: Number(e.target.value) } : s)}
                className={INPUT + ' w-full'}>
                {[15,20,30,45,60,90,120].map(v => <option key={v} value={v}>{v} Min.</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Vorlaufzeit (Std.)</label>
              <select value={settings.min_advance_hours}
                onChange={e => setSettings(s => s ? { ...s, min_advance_hours: Number(e.target.value) } : s)}
                className={INPUT + ' w-full'}>
                {[1,2,4,6,12,24,48].map(v => <option key={v} value={v}>{v} Std.</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Max. Tage voraus</label>
              <select value={settings.max_days_ahead}
                onChange={e => setSettings(s => s ? { ...s, max_days_ahead: Number(e.target.value) } : s)}
                className={INPUT + ' w-full'}>
                {[7,14,21,30,60,90].map(v => <option key={v} value={v}>{v} Tage</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Weekday settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Öffnungszeiten</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {settings.weekdays.map((wd, idx) => (
            <div key={wd.weekday} className="px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => updateWd(idx, 'is_open', !wd.is_open)}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${wd.is_open ? 'bg-[#1D9E75]' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${wd.is_open ? 'translate-x-5' : ''}`} />
                </button>
                <span className={`text-sm font-medium ${wd.is_open ? 'text-gray-800' : 'text-gray-400'}`}>
                  {WEEKDAY_LABELS[wd.weekday]}
                </span>
                {!wd.is_open && <span className="text-xs text-gray-400">Geschlossen</span>}
              </div>
              {wd.is_open && (
                <div className="grid grid-cols-2 gap-3 pl-13">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Öffnung</label>
                    <input type="time" value={wd.open_time}
                      onChange={e => updateWd(idx, 'open_time', e.target.value)}
                      className={INPUT + ' w-full'} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Schließung</label>
                    <input type="time" value={wd.close_time}
                      onChange={e => updateWd(idx, 'close_time', e.target.value)}
                      className={INPUT + ' w-full'} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Pause von</label>
                    <input type="time" value={wd.break_start || ''}
                      onChange={e => updateWd(idx, 'break_start', e.target.value || null)}
                      className={INPUT + ' w-full'} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Pause bis</label>
                    <input type="time" value={wd.break_end || ''}
                      onChange={e => updateWd(idx, 'break_end', e.target.value || null)}
                      className={INPUT + ' w-full'} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
