'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  {
    icon: '👋',
    title: 'Willkommen bei No-Show-Killer!',
    desc: 'In 3 Schritten bist du startklar. Wir zeigen dir wie du No-Shows auf ein Minimum reduzierst.',
    cta: 'Los geht\'s →',
  },
  {
    icon: '📱',
    title: 'So funktioniert\'s',
    desc: 'Du trägst einen Termin ein → 24h vorher geht automatisch eine WhatsApp-Erinnerung raus → der Kunde bestätigt oder sagt ab → du hast keine bösen Überraschungen mehr.',
    cta: 'Verstanden →',
  },
  {
    icon: '📅',
    title: 'Ersten Termin anlegen',
    desc: 'Trag jetzt deinen ersten Termin ein. Nutze deine eigene Nummer zum Testen — du bekommst dann eine echte WhatsApp-Erinnerung.',
    cta: 'Ersten Termin anlegen →',
    final: true,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  function next() {
    if (steps[step].final) {
      router.push('/dashboard/appointments/new')
    } else {
      setStep(s => s + 1)
    }
  }

  const current = steps[step]

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-[#1D9E75]' : i < step ? 'w-2 bg-[#1D9E75] opacity-40' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-5">
          <div className="text-6xl">{current.icon}</div>
          <h1 className="text-xl font-bold text-gray-900">{current.title}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">{current.desc}</p>
          <button
            onClick={next}
            className="w-full py-4 bg-[#1D9E75] text-white text-base font-bold rounded-2xl hover:bg-[#178a64] transition-colors"
          >
            {current.cta}
          </button>
        </div>

        {/* Skip */}
        {!steps[step].final && (
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600"
          >
            Überspringen
          </button>
        )}
      </div>
    </main>
  )
}
