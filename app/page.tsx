import Link from 'next/link'

const testimonials = [
  {
    name: 'Sandra K.',
    role: 'Physiotherapeutin, München',
    text: 'Früher hatte ich 3–4 No-Shows pro Woche. Seit No-Show-Killer ist es fast null. Das sind locker 200 € mehr im Monat.',
    avatar: 'S',
  },
  {
    name: 'Marco T.',
    role: 'Friseurmeister, Hamburg',
    text: 'Die App läuft einfach. Kein Aufwand, keine Erklärung nötig. Die Erinnerungen gehen raus und die Kunden kommen.',
    avatar: 'M',
  },
  {
    name: 'Petra L.',
    role: 'Massagepraxis, Berlin',
    text: 'Ich hatte Angst, dass es kompliziert wird. War es nicht. In 10 Minuten war alles eingerichtet und es funktioniert.',
    avatar: 'P',
  },
]

const plans = [
  {
    key: 'basis',
    name: 'Basis',
    price: 29,
    description: 'Für den Einstieg',
    features: [
      'Bis 50 Termine pro Monat',
      'WhatsApp-Erinnerungen',
      'Kundenverwaltung',
      '14 Tage kostenlos testen',
    ],
    popular: false,
    cta: 'Kostenlos starten',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 49,
    description: 'Für wachsende Praxen',
    features: [
      'Unbegrenzte Termine',
      'WhatsApp-Erinnerungen',
      'Wochenbericht & Umsatz-Tracker',
      'Automatische Warteliste',
      '14 Tage kostenlos testen',
    ],
    popular: true,
    cta: 'Jetzt Pro testen',
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 89,
    description: 'Für Profis',
    features: [
      'Alles aus Pro',
      'Eigenes Branding im WhatsApp-Chat',
      'Mehrere Mitarbeiter & Kalender',
      'Priority Support',
      '14 Tage kostenlos testen',
    ],
    popular: false,
    cta: 'Premium testen',
  },
]

const steps = [
  { num: '1', title: 'Konto anlegen', text: 'In 2 Minuten registriert. Kein technisches Wissen nötig.' },
  { num: '2', title: 'Termine eintragen', text: 'Kunde, Datum, Uhrzeit — fertig. Oder dein Kalender direkt verbinden.' },
  { num: '3', title: 'Erinnerung geht raus', text: '24 Stunden vorher bekommt dein Kunde eine WhatsApp. Automatisch.' },
  { num: '4', title: 'Geld bleibt in der Kasse', text: 'Keine Erinnerung = mehr No-Shows = weniger Umsatz. Wir verhindern das.' },
]

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold">📵 No-Show-Killer</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800">Einloggen</Link>
          <Link href="/login" className="text-sm bg-[#1D9E75] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#178a64] transition-colors">
            Kostenlos starten
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-2xl mx-auto">
        <div className="inline-block bg-green-50 text-[#1D9E75] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          14 Tage kostenlos — kein Risiko
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          Nie wieder Geld verlieren durch <span className="text-[#1D9E75]">vergessene Termine</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 leading-relaxed">
          No-Show-Killer erinnert deine Kunden automatisch per WhatsApp. Du tust nichts — und trotzdem kommen sie.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="bg-[#1D9E75] text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-[#178a64] transition-colors shadow-md">
            Jetzt kostenlos testen →
          </Link>
          <a href="#wie-es-funktioniert" className="border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition-colors">
            Wie funktioniert es?
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-400">Keine Kreditkarte nötig · Jederzeit kündbar · 14 Tage gratis</p>
      </section>

      {/* Zahlen-Banner */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: '€ 180', label: 'Ø Verlust pro Woche durch No-Shows' },
            { value: '94 %', label: 'weniger No-Shows nach 30 Tagen' },
            { value: '< 10 Min', label: 'bis die App läuft' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl sm:text-4xl font-bold text-[#1D9E75]">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wie es funktioniert */}
      <section id="wie-es-funktioniert" className="py-20 px-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">So einfach funktioniert es</h2>
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-full bg-[#1D9E75] text-white flex items-center justify-center text-xl font-bold shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-500 mt-1">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Was Praxisinhaber sagen</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1D9E75] text-white flex items-center justify-center font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preise" className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Einfache Preise</h2>
        <p className="text-center text-gray-500 mb-12">
          Ein einziger verhindeter No-Show bezahlt deinen ganzen Monat.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? 'border-[#1D9E75] ring-2 ring-[#1D9E75] shadow-lg relative'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D9E75] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Beliebtester Plan
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price} €</span>
                <span className="text-gray-400 text-sm">/Monat</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-[#1D9E75] shrink-0 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`text-center py-3 rounded-xl font-bold text-sm transition-colors ${
                  plan.popular
                    ? 'bg-[#1D9E75] text-white hover:bg-[#178a64]'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1D9E75] py-20 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Bereit? Starte heute kostenlos.</h2>
        <p className="text-lg opacity-80 mb-8 max-w-md mx-auto">
          14 Tage gratis, keine Kreditkarte, jederzeit kündbar. Du hast nichts zu verlieren — außer deine No-Shows.
        </p>
        <Link
          href="/login"
          className="inline-block bg-white text-[#1D9E75] px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-colors shadow-md"
        >
          Jetzt loslegen →
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-gray-400 border-t border-gray-100">
        © 2026 No-Show-Killer · <Link href="/login" className="hover:text-gray-600">Einloggen</Link>
      </footer>
    </main>
  )
}
