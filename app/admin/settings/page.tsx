'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Settings = Record<string, string>

const FIELDS = [
  {
    section: 'Absender (Rechnungskopf)',
    fields: [
      { key: 'sender_name', label: 'Anzeigename' },
      { key: 'sender_company', label: 'Firma / Rechtsform' },
      { key: 'sender_street', label: 'Straße & Hausnummer' },
      { key: 'sender_zip', label: 'PLZ' },
      { key: 'sender_city', label: 'Stadt' },
      { key: 'sender_country', label: 'Land' },
      { key: 'sender_email', label: 'Support-E-Mail' },
    ],
  },
  {
    section: 'Impressum (Pflichtangaben)',
    fields: [
      { key: 'sender_phone', label: 'Telefonnummer' },
      { key: 'sender_responsible', label: 'Verantwortliche Person (falls abweichend)' },
      { key: 'sender_register_court', label: 'Registergericht (z.B. Amtsgericht München)' },
      { key: 'sender_register_number', label: 'Handelsregisternummer (z.B. HRB 123456)' },
    ],
  },
  {
    section: 'Steuer',
    fields: [
      { key: 'sender_vat', label: 'USt-ID' },
      { key: 'sender_tax_number', label: 'Steuernummer' },
    ],
  },
  {
    section: 'Bankverbindung (für Rechnungsfußzeile)',
    fields: [
      { key: 'bank_name', label: 'Bank' },
      { key: 'bank_iban', label: 'IBAN' },
      { key: 'bank_bic', label: 'BIC' },
    ],
  },
]

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(setSettings)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin')} className="text-gray-400 hover:text-gray-700 text-xl">←</button>
          <h1 className="text-xl font-bold text-gray-900">Absender & Rechnungseinstellungen</h1>
        </div>

        {saved && (
          <div className="bg-[#1D9E75] text-white px-4 py-3 rounded-xl font-medium">Gespeichert ✓</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {FIELDS.map(({ section, fields }) => (
            <div key={section} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="font-semibold text-gray-700">{section}</h2>
              {fields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    type="text"
                    value={settings[key] ?? ''}
                    onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-[#1D9E75] text-white text-base font-bold rounded-2xl hover:bg-[#178a64] transition-colors disabled:opacity-50"
          >
            {saving ? 'Speichert...' : 'Speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}
