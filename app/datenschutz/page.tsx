import Link from 'next/link'
import pool from '@/lib/db'

async function getSettings(): Promise<Record<string, string>> {
  const result = await pool.query('SELECT key, value FROM app_settings')
  const s: Record<string, string> = {}
  for (const row of result.rows) s[row.key] = row.value ?? ''
  return s
}

export default async function DatenschutzPage() {
  const s = await getSettings()
  const name = s.sender_company || s.sender_name || '[Firmenname]'
  const address = `${s.sender_street || ''}, ${s.sender_zip || ''} ${s.sender_city || ''}`
  const email = s.sender_email || 'support@terminsicher.app'

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-[#1D9E75] hover:underline mb-8 inline-block">← Zurück zur Startseite</Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 text-gray-700 text-sm leading-relaxed">

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">1. Verantwortlicher</h2>
            <p>Verantwortlicher im Sinne der DSGVO ist:</p>
            <p>
              <strong>{name}</strong><br />
              {s.sender_street && <>{s.sender_street}<br /></>}
              {s.sender_zip} {s.sender_city}<br />
              E-Mail: <a href={`mailto:${email}`} className="text-[#1D9E75]">{email}</a>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">2. Erhobene Daten & Zweck</h2>
            <p>Wir verarbeiten folgende personenbezogene Daten:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Registrierungsdaten</strong> (Name, E-Mail, Passwort-Hash) — zur Bereitstellung des Accounts</li>
              <li><strong>Kundendaten</strong> (Name, Telefonnummer) — zur Terminverwaltung und zum WhatsApp-Erinnerungsversand</li>
              <li><strong>Zahlungsdaten</strong> — werden ausschließlich über Stripe verarbeitet, wir speichern keine Kreditkartendaten</li>
              <li><strong>Kommunikationsdaten</strong> — WhatsApp-Nachrichten werden über Twilio versandt</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">3. Rechtsgrundlagen</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Art. 6 Abs. 1 lit. b DSGVO — Vertragserfüllung (Bereitstellung des Dienstes)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO — berechtigte Interessen (Sicherheit, Betrugsprävention)</li>
              <li>Art. 6 Abs. 1 lit. a DSGVO — Einwilligung (beim Eintragen von Kundendaten)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">4. Auftragsverarbeiter & Drittanbieter</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>DigitalOcean</strong> (Hosting & Datenbank, Frankfurt/EU) — <a href="https://www.digitalocean.com/legal/data-processing-agreement" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">Auftragsverarbeitungsvertrag</a></li>
              <li><strong>Stripe</strong> (Zahlungsabwicklung) — <a href="https://stripe.com/de/privacy" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a></li>
              <li><strong>Twilio</strong> (WhatsApp-Versand) — <a href="https://www.twilio.com/legal/privacy" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a></li>
              <li><strong>Resend</strong> (E-Mail-Versand) — <a href="https://resend.com/legal/privacy-policy" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a></li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">5. Speicherdauer</h2>
            <p>Wir speichern personenbezogene Daten nur solange es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen (z.B. 10 Jahre für Rechnungen gemäß §§ 238, 257 HGB).</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">6. Deine Rechte (Art. 15–21 DSGVO)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Auskunft über gespeicherte Daten (Art. 15)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16)</li>
              <li>Löschung deiner Daten („Recht auf Vergessenwerden", Art. 17)</li>
              <li>Einschränkung der Verarbeitung (Art. 18)</li>
              <li>Datenübertragbarkeit (Art. 20)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21)</li>
            </ul>
            <p>Anfragen bitte an: <a href={`mailto:${email}`} className="text-[#1D9E75]">{email}</a></p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">7. Cookies & Tracking</h2>
            <p>Wir verwenden ausschließlich technisch notwendige Cookies (Session-Cookie für die Anmeldung, HttpOnly). Es werden keine Tracking- oder Werbe-Cookies eingesetzt. Es findet kein Einsatz von Google Analytics oder ähnlichen Diensten statt.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900 text-base">8. Beschwerderecht</h2>
            <p>Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. In Deutschland ist dies der Landesbeauftragte für den Datenschutz des jeweiligen Bundeslandes. Eine Liste findest du unter <a href="https://www.bfdi.bund.de" className="text-[#1D9E75]" target="_blank" rel="noopener noreferrer">www.bfdi.bund.de</a>.</p>
          </section>

          <p className="text-gray-400 text-xs pt-4 border-t border-gray-100">Stand: Juni 2026</p>
        </div>
      </div>
    </main>
  )
}
