'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

type Business = {
  id: string
  name: string
  owner_email: string
  plan: string
  address_street: string
  address_zip: string
  address_city: string
  address_country: string
  vat_number: string
  phone: string
  subscription_status: string
}

export default function AdminBusinessEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState<Business | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/businesses/${id}`)
      .then(r => r.json())
      .then(data => setForm({
        ...data,
        address_street: data.address_street ?? '',
        address_zip: data.address_zip ?? '',
        address_city: data.address_city ?? '',
        address_country: data.address_country ?? 'DE',
        vat_number: data.vat_number ?? '',
        phone: data.phone ?? '',
      }))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function field(label: string, key: keyof Business, type = 'text') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input
          type={type}
          value={(form as Record<string, string>)[key] ?? ''}
          onChange={e => setForm(f => f ? { ...f, [key]: e.target.value } : f)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
        />
      </div>
    )
  }

  if (!form) return <div className="min-h-screen flex items-center justify-center text-gray-400">Lädt...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin')} className="text-gray-400 hover:text-gray-700 text-xl">←</button>
          <h1 className="text-xl font-bold text-gray-900">Business bearbeiten</h1>
        </div>

        {saved && (
          <div className="bg-[#1D9E75] text-white px-4 py-3 rounded-xl font-medium">Gespeichert ✓</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="font-semibold text-gray-700">Stammdaten</h2>
            {field('Praxisname', 'name')}
            {field('E-Mail (Inhaber)', 'owner_email', 'email')}
            {field('Telefon', 'phone', 'tel')}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Plan</label>
              <select
                value={form.plan}
                onChange={e => setForm(f => f ? { ...f, plan: e.target.value } : f)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              >
                <option value="basis">Basis</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="font-semibold text-gray-700">Rechnungsadresse</h2>
            {field('Straße & Hausnummer', 'address_street')}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">{field('PLZ', 'address_zip')}</div>
              <div className="col-span-2">{field('Stadt', 'address_city')}</div>
            </div>
            {field('Land', 'address_country')}
            {field('USt-ID (optional)', 'vat_number')}
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-sm text-gray-500 space-y-1">
            <p><span className="font-medium text-gray-700">Status:</span> {form.subscription_status}</p>
            <p><span className="font-medium text-gray-700">ID:</span> {form.id}</p>
          </div>

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
