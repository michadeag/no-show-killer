import Link from 'next/link'

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-[#1D9E75] hover:underline mb-8 inline-block">← Zurück zur Startseite</Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 text-gray-700 text-sm leading-relaxed">

          <section className="space-y-1">
            <h2 className="font-semibold text-gray-900 text-base">Angaben gemäß § 5 TMG</h2>
            <p><strong>[Firmenname / Vor- und Nachname]</strong></p>
            <p>[Straße und Hausnummer]</p>
            <p>[PLZ] [Stadt]</p>
            <p>[Land]</p>
          </section>

          <section className="space-y-1">
            <h2 className="font-semibold text-gray-900 text-base">Kontakt</h2>
            <p>Telefon: <a href="tel:[TELEFON]" className="text-[#1D9E75]">[TELEFON]</a></p>
            <p>E-Mail: <a href="mailto:support@terminsicher.app" className="text-[#1D9E75]">support@terminsicher.app</a></p>
          </section>

          <section className="space-y-1">
            <h2 className="font-semibold text-gray-900 text-base">Registereintrag</h2>
            <p>Registergericht: [z.B. Amtsgericht München]</p>
            <p>Registernummer: [z.B. HRB 123456]</p>
            <p className="text-gray-400 text-xs">(Nur ausfüllen wenn im Handelsregister eingetragen)</p>
          </section>

          <section className="space-y-1">
            <h2 className="font-semibold text-gray-900 text-base">Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:</p>
            <p>[USt-ID oder Steuernummer]</p>
          </section>

          <section className="space-y-1">
            <h2 className="font-semibold text-gray-900 text-base">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>[Vor- und Nachname]</p>
            <p>[Adresse wie oben]</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">Haftungsausschluss</h2>
            <p>Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">Urheberrecht</h2>
            <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
          </section>

          <p className="text-gray-400 text-xs pt-4 border-t border-gray-100">
            Streitschlichtung: Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </div>
    </main>
  )
}
