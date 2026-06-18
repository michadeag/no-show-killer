'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🔑</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Passwort vergessen</h1>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-4">
            <span className="text-4xl">📬</span>
            <p className="text-gray-700 font-medium">E-Mail gesendet!</p>
            <p className="text-gray-500 text-sm">Falls ein Account mit dieser E-Mail existiert, erhältst du einen Link zum Zurücksetzen. Bitte prüfe auch deinen Spam-Ordner.</p>
            <Link href="/login" className="inline-block text-sm text-[#1D9E75] font-medium hover:underline">
              Zurück zum Login →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Deine E-Mail-Adresse</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1D9E75] text-white text-lg font-bold rounded-2xl hover:bg-[#178a64] transition-colors disabled:opacity-50"
            >
              {loading ? 'Sende...' : 'Reset-Link senden →'}
            </button>
            <div className="text-center">
              <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600">Zurück zum Login</Link>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
