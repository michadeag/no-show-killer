'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) return setError('Passwörter stimmen nicht überein')
    if (password.length < 8) return setError('Mindestens 8 Zeichen')

    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error || 'Fehler beim Zurücksetzen')
    setDone(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <span className="text-4xl">❌</span>
        <p className="text-gray-700">Ungültiger Link.</p>
        <Link href="/forgot-password" className="text-[#1D9E75] font-medium hover:underline">Neuen Link anfordern →</Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <span className="text-4xl">🔐</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Neues Passwort</h1>
      </div>

      {done ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-4">
          <span className="text-4xl">✅</span>
          <p className="text-gray-700 font-medium">Passwort erfolgreich geändert!</p>
          <p className="text-gray-500 text-sm">Du wirst zum Login weitergeleitet...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-[#E24B4A] text-[#E24B4A] px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Neues Passwort</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mindestens 8 Zeichen"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Passwort bestätigen</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Passwort wiederholen"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1D9E75] text-white text-lg font-bold rounded-2xl hover:bg-[#178a64] transition-colors disabled:opacity-50"
          >
            {loading ? 'Speichert...' : 'Passwort speichern →'}
          </button>
        </form>
      )}
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <Suspense>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </main>
  )
}
