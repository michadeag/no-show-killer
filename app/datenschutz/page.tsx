import Link from 'next/link'

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-[#1D9E75] hover:underline mb-8 inline-block">← Zurück zur Startseite</Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 text-gray-700 text-sm leading-relaxed">

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">1. Verantwortlicher</h2>
            <p>Verantwortlicher im Sinne der DSGVO ist:</p>
            <p><strong>[Firmenname / Vor- und Nachname]</strong><br />
            [Straße und Hausnummer]<br />
            [PLZ] [Stadt]<br />
            E-Mail: <a href="mailto:support@terminsicher.app" className="text-[#1D9E75]">support@terminsicher.app</a></p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">2. Erhobene Daten & Zweck</h2>
            <p>Wir verarbeiten folgende personenbezogene Daten:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Registrierungsdaten</strong> (Name, E-Mail, Passwort-Hash) — zur Bereitstellung des Accounts</li>
              <li><strong>Kundendaten</strong> (Name, Telefonnummer) — zur Terminverwaltung und Erinnerungsversand</li>
              <li><strong>Zahlungsdaten</strong> — werden ausschließlich über Stripe verarbeitet, wir speichern keine Kreditkartendaten</li>
              <li><strong>Kommunikationsdaten</strong> — WhatsApp-Nachrichten werden über Twilio versandt</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">3. Rechtsgrundlagen</h2>
            <p>Die Verarbeitung erfolgt auf Basis von:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Art. 6 Abs. 1 lit. b DSGVO — Vertragserfüllung (Bereitstellung des Dienstes)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO — berechtigte Interessen (Sicherheit, Betrugsprävention)</li>
              <li>Art. 6 Abs. 1 lit. a DSGVO — Einwilligung (beim Eintragen von Kundendaten)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">4. Drittanbieter & Auftragsverarbeiter</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>DigitalOcean</strong> (Hosting & Datenbank) — Server in Frankfurt, EU. <a href="https://www.digitalocean.com/legal/data-processing-agreement" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">DPA</a></li>
              <li><strong>Stripe</strong> (Zahlungsabwicklung) — <a href="https://stripe.com/de/privacy" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">Datenschutz</a></li>
              <li><strong>Twilio</strong> (WhatsApp-Versand) — <a href="https://www.twilio.com/legal/privacy" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">Datenschutz</a></li>
              <li><strong>Resend</strong> (E-Mail-Versand) — <a href="https://resend.com/legal/privacy-policy" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">Datenschutz</a></li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">5. Speicherdauer</h2>
            <p>Wir speichern personenbezogene Daten nur solange es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen (z.B. 10 Jahre für Rechnungen nach §§ 238, 257 HGB).</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">6. Deine Rechte</h2>
            <p>Du hast das Recht auf:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <p>Anfragen richte bitte an: <a href="mailto:support@terminsicher.app" className="text-[#1D9E75]">support@terminsicher.app</a></p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">7. Cookies & Tracking</h2>
            <p>Wir verwenden ausschließlich technisch notwendige Cookies (Session-Cookie für die Anmeldung). Es werden keine Tracking- oder Werbe-Cookies gesetzt. Es findet kein Einsatz von Google Analytics oder ähnlichen Diensten statt.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">8. Beschwerderecht</h2>
            <p>Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. In Deutschland ist dies der Landesbeauftragte für den Datenschutz des jeweiligen Bundeslandes.</p>
          </section>

          <p className="text-gray-400 text-xs pt-4 border-t border-gray-100">Stand: Juni 2026</p>
        </div>
      </div>
    </main>
  )
}
