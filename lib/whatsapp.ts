import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendWhatsAppMessage(phone: string, message: string) {
  const to = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to,
    body: message,
  })
}

export function buildReminderMessage(customerName: string, scheduledAt: string): string {
  const date = new Date(scheduledAt)
  const formatted = date.toLocaleString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  return `Hallo ${customerName} 👋\n\nErinnerung an deinen Termin:\n📅 *${formatted} Uhr*\n\nBitte antworte mit *JA* zur Bestätigung oder ruf uns an falls du absagen möchtest. 🙏`
}
