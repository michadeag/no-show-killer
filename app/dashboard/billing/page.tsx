'use client'
import { useState, Suspense } from 'react'
import { PLANS } from '@/lib/plans'
import { useSearchParams } from 'next/navigation'

const planOrder = ['basis', 'pro', 'premium'] as const

function BillingContent() {
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const cancelled = searchParams.get('cancelled')

  async function handleCheckout(plan: string) {
    setLoading(plan)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(null)
  }

  async function handlePortal() {
    setLoading('portal')
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Abo & Zahlung</h1>

      {success && (
        <div className="bg-green-50 border border-[#1D9E75] text-[#1D9E75] px-4 py-3 rounded-xl font-medium">
          Zahlung erfolgreich — dein Plan ist jetzt aktiv!
        </div>
      )}
      {cancelled && (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-xl">
          Buchung abgebrochen — du kannst jederzeit einen Plan wählen.
        </div>
      )}

      {/* Pläne */}
      <div className="space-y-4">
        {planOrder.map((key) => {
          const plan = PLANS[key]
          const isPopular = key === 'pro'
          return (
            <div
              key={key}
              className={`bg-white rounded-2xl border shadow-sm p-5 ${
                isPopular ? 'border-[#1D9E75] ring-1 ring-[#1D9E75]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  {isPopular && (
                    <span className="text-xs bg-[#1D9E75] text-white px-2 py-0.5 rounded-full font-semibold mr-2">
                      Beliebtester Plan
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-gray-900 inline">{plan.name}</h2>
                </div>
                <span className="text-2xl font-bold text-gray-900">{plan.price} €<span className="text-sm font-normal text-gray-400">/Mo</span></span>
              </div>

              <ul className="space-y-1 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-[#1D9E75]">✓</span> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(key)}
                disabled={loading === key}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 ${
                  isPopular
                    ? 'bg-[#1D9E75] text-white hover:bg-[#178a64]'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {loading === key ? 'Weiterleitung...' : `${plan.name} wählen – 14 Tage kostenlos testen`}
              </button>
            </div>
          )
        })}
      </div>

      {/* Stripe-Portal für bestehende Abos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-1">Bestehendes Abo verwalten</h2>
        <p className="text-sm text-gray-500 mb-3">Zahlungsmethode ändern, Rechnung herunterladen, Abo kündigen</p>
        <button
          onClick={handlePortal}
          disabled={loading === 'portal'}
          className="text-sm px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading === 'portal' ? 'Weiterleitung...' : 'Zum Zahlungsportal →'}
        </button>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Laden...</div>}>
      <BillingContent />
    </Suspense>
  )
}
