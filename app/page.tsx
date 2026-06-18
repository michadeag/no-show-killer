import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="max-w-lg w-full text-center">
        {/* Logo / Headline */}
        <div className="mb-6">
          <span className="text-5xl">📵</span>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 leading-tight">
            No-Show-Killer
          </h1>
        </div>

        {/* 3-Satz-Erklärung */}
        <div className="space-y-3 mb-10 text-lg text-gray-600">
          <p>
            Deine Kunden vergessen Termine — du verlierst Geld.
          </p>
          <p>
            No-Show-Killer erinnert sie automatisch per WhatsApp und füllt
            freie Plätze sofort wieder auf.
          </p>
          <p className="font-semibold text-gray-800">
            Kein Aufwand für dich. Mehr Umsatz ab dem ersten Tag.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="inline-block w-full py-4 px-8 rounded-2xl text-white text-xl font-bold bg-[#1D9E75] hover:bg-[#178a64] transition-colors shadow-md"
        >
          Jetzt einloggen →
        </Link>

        <p className="mt-4 text-sm text-gray-400">
          Noch kein Konto? Melde dich an — kostenlos starten.
        </p>
      </div>
    </main>
  );
}
