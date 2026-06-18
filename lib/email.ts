import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM || 'onboarding@resend.dev'

export async function sendPaymentFailedEmail(to: string, businessName: string, amount: number) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: '⚠️ Zahlung fehlgeschlagen – No-Show-Killer',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#E24B4A">Zahlung fehlgeschlagen</h2>
        <p>Hallo ${businessName},</p>
        <p>leider konnte deine Zahlung von <strong>${amount} €</strong> für No-Show-Killer nicht verarbeitet werden.</p>
        <p>Bitte aktualisiere deine Zahlungsmethode damit dein Zugang nicht gesperrt wird:</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/billing"
           style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Zahlungsmethode aktualisieren
        </a>
        <p style="color:#999;font-size:12px">No-Show-Killer · Automatische Benachrichtigung</p>
      </div>
    `,
  })
}

export async function sendPaymentSuccessEmail(to: string, businessName: string, amount: number, plan: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: '✅ Zahlung bestätigt – No-Show-Killer',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#1D9E75">Zahlung erfolgreich</h2>
        <p>Hallo ${businessName},</p>
        <p>deine Zahlung von <strong>${amount} €</strong> für den <strong>${plan}-Plan</strong> wurde erfolgreich verarbeitet.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard"
           style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Zum Dashboard
        </a>
        <p style="color:#999;font-size:12px">No-Show-Killer · Automatische Bestätigung</p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(to: string, businessName: string, plan: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: '🎉 Willkommen bei No-Show-Killer!',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#1D9E75">Willkommen, ${businessName}!</h2>
        <p>Dein <strong>${plan}-Plan</strong> ist jetzt aktiv. Ab sofort verlierst du kein Geld mehr durch No-Shows.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard"
           style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Jetzt starten →
        </a>
        <p style="color:#999;font-size:12px">No-Show-Killer · Du kannst jederzeit kündigen</p>
      </div>
    `,
  })
}

export async function sendPaymentReminderEmail(to: string, businessName: string, amount: number, daysOverdue: number) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `⏰ Zahlungserinnerung – ${daysOverdue} Tage überfällig`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#E24B4A">Zahlungserinnerung</h2>
        <p>Hallo ${businessName},</p>
        <p>deine Rechnung über <strong>${amount} €</strong> ist seit ${daysOverdue} Tagen offen.</p>
        <p>Bitte begleiche die offene Zahlung um deinen Zugang zu behalten:</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/billing"
           style="display:inline-block;background:#E24B4A;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Jetzt bezahlen
        </a>
        <p style="color:#999;font-size:12px">Bei Fragen antworte einfach auf diese E-Mail.</p>
      </div>
    `,
  })
}
