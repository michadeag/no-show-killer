// Phase 1: Mock — schreibt nur ins Konsolen-Log
// Phase 2: Hier kommt die echte Twilio/360dialog-Integration

export function sendWhatsAppMessage(phone: string, message: string): void {
  console.log(`[WhatsApp MOCK] Gesendet an ${phone}: "${message}"`)
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
  return `Hallo ${customerName}, wir erinnern dich an deinen Termin am ${formatted} Uhr. Bitte antworte mit JA zur Bestätigung oder ruf uns an, falls du absagen möchtest.`
}
