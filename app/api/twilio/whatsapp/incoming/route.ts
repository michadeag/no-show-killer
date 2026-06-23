import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

// Twilio sends form-encoded POST for incoming WhatsApp messages
export async function POST(req: NextRequest) {
  const body = await req.text()
  const params = new URLSearchParams(body)

  const from    = params.get('From') || ''   // e.g. "whatsapp:+49151..."
  const message = (params.get('Body') || '').trim().toLowerCase()

  const phone = from.replace('whatsapp:', '')

  // Only handle JA/YES confirmations
  const isConfirmation = ['ja', 'yes', 'jo', 'ok', 'jup', 'jep'].includes(message)

  if (!isConfirmation) {
    // Return empty TwiML — don't reply to other messages
    return new NextResponse('<Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
    })
  }

  // Find the most recent upcoming 'reminded' appointment for this phone number
  const result = await pool.query(`
    SELECT a.id, a.business_id, a.scheduled_at, c.full_name,
           b.branding_name, b.name as business_name
    FROM appointments a
    JOIN customers c ON c.id = a.customer_id
    JOIN businesses b ON b.id = a.business_id
    WHERE c.phone_number = $1
      AND a.status = 'reminded'
      AND a.scheduled_at > NOW()
    ORDER BY a.scheduled_at ASC
    LIMIT 1
  `, [phone])

  if (!result.rows.length) {
    return new NextResponse('<Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
    })
  }

  const appt = result.rows[0]

  // Mark as confirmed
  await pool.query(
    `UPDATE appointments SET status = 'confirmed', confirmed_at = NOW() WHERE id = $1`,
    [appt.id]
  )

  // Log
  await pool.query(
    `INSERT INTO automation_log (business_id, appointment_id, action_type, details)
     VALUES ($1, $2, 'confirmed_via_whatsapp', $3)`,
    [appt.business_id, appt.id, `Bestätigung per WhatsApp von ${phone}`]
  )

  // Send confirmation back
  const formatted = new Date(appt.scheduled_at).toLocaleString('de-DE', {
    weekday: 'long', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Berlin',
  })
  const businessName = appt.branding_name || appt.business_name

  await sendWhatsAppMessage(
    phone,
    `Perfekt, ${appt.full_name}! ✅\n\nDein Termin am *${formatted} Uhr* bei *${businessName}* ist bestätigt.\n\nBis dann! 👋`
  )

  return new NextResponse('<Response></Response>', {
    headers: { 'Content-Type': 'text/xml' },
  })
}
