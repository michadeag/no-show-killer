'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', businessName: '',
  })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email: loginForm.email,
      password: loginForm.password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('E-Mail oder Passwort falsch')
    } else {
      router.push('/dashboard')
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Fehler bei der Registrierung')
      setLoading(false)
      return
    }
    // Nach Registrierung direkt einloggen
    await signIn('credentials', {
      email: registerForm.email,
      password: registerForm.password,
      redirect: false,
    })
    router.push('/onboarding')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">📵</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">No-Show-Killer</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setTab('login'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            Einloggen
          </button>
          <button
            onClick={() => { setTab('register'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            Registrieren
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-[#E24B4A] text-[#E24B4A] px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">E-Mail</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                placeholder="deine@email.de"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Passwort</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1D9E75] text-white text-lg font-bold rounded-2xl hover:bg-[#178a64] transition-colors disabled:opacity-50"
            >
              {loading ? 'Einloggen...' : 'Einloggen →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Dein Name</label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={e => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Max Mustermann"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name deiner Praxis / deines Salons</label>
              <input
                type="text"
                required
                value={registerForm.businessName}
                onChange={e => setRegisterForm(f => ({ ...f, businessName: e.target.value }))}
                placeholder="Physio Praxis Musterstadt"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">E-Mail</label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                placeholder="deine@email.de"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Passwort</label>
              <input
                type="password"
                required
                minLength={8}
                value={registerForm.password}
                onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Mindestens 8 Zeichen"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1D9E75] text-white text-lg font-bold rounded-2xl hover:bg-[#178a64] transition-colors disabled:opacity-50"
            >
              {loading ? 'Konto wird erstellt...' : 'Konto erstellen →'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
