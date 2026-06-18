import Link from 'next/link'
import pool from '@/lib/db'

async function getSettings(): Promise<Record<string, string>> {
  const result = await pool.query('SELECT key, value FROM app_settings')
  const s: Record<string, string> = {}
  for (const row of result.rows) s[row.key] = row.value ?? ''
  return s
}

export default async function ImpressumPage() {
  const s = await getSettings()

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-[#1D9E75] hover:underline mb-8 inline-block">← Zurück zur Startseite</Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 text-gray-700 text-sm leading-relaxed">

          <section className="space-y-1">
            <h2 className="font-semibold text-gray-900 text-base">Angaben gemäß § 5 TMG</h2>
            <p><strong>{s.sender_company || s.sender_name || '[Firmenname eintragen]'}</strong></p>
            <p>{s.sender_street || '[Straße eintragen]'}</p>
            <p>{s.sender_zip} {s.sender_city}</p>
            <p>{s.sender_country || 'Deutschland'}</p>
          </section>

          <section className="space-y-1">
            <h2 className="font-semibold text-gray-900 text-base">Kontakt</h2>
            {s.sender_phone && <p>Telefon: <a href={`tel:${s.sender_phone}`} className="text-[#1D9E75]">{s.sender_phone}</a></p>}
            <p>E-Mail: <a href={`mailto:${s.sender_email || 'support@terminsicher.app'}`} className="text-[#1D9E75]">{s.sender_email || 'support@terminsicher.app'}</a></p>
          </section>

          {(s.sender_register_court || s.sender_register_number) && (
            <section className="space-y-1">
              <h2 className="font-semibold text-gray-900 text-base">Registereintrag</h2>
              {s.sender_register_court && <p>Registergericht: {s.sender_register_court}</p>}
              {s.sender_register_number && <p>Registernummer: {s.sender_register_number}</p>}
            </section>
          )}

          {(s.sender_vat || s.sender_tax_number) && (
            <section className="space-y-1">
              <h2 className="font-semibold text-gray-900 text-base">Umsatzsteuer</h2>
              {s.sender_vat && <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {s.sender_vat}</p>}
              {s.sender_tax_number && !s.sender_vat && <p>Steuernummer: {s.sender_tax_number}</p>}
            </section>
          )}

          <section className="space-y-1">
            <h2 className="font-semibold text-gray-900 text-base">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>{s.sender_responsible || s.sender_name || '[Name eintragen]'}</p>
            <p>{s.sender_street}</p>
            <p>{s.sender_zip} {s.sender_city}</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">Haftungsausschluss</h2>
            <p>Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">Urheberrecht</h2>
            <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors.</p>
          </section>

          <p className="text-gray-400 text-xs pt-4 border-t border-gray-100">
            Streitschlichtung: Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">
              https://ec.europa.eu/consumers/odr/
            </a>. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </div>
    </main>
  )
}
