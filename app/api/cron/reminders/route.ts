import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { sendWhatsAppMessage, buildReminderMessage } from '@/lib/whatsapp'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000)

  const result = await pool.query(
    `SELECT a.*, c.full_name, c.phone_number
     FROM appointments a
     JOIN customers c ON c.id = a.customer_id
     WHERE a.status = 'scheduled'
       AND a.reminder_sent_at IS NULL
       AND a.scheduled_at >= $1
       AND a.scheduled_at < $2`,
    [in24h, in25h]
  )

  const appointments = result.rows
  let sent = 0
  const errors: string[] = []

  for (const apt of appointments) {
    try {
      const message = buildReminderMessage(apt.full_name, apt.scheduled_at)
      await sendWhatsAppMessage(apt.phone_number, message)
      await pool.query(
        `UPDATE appointments SET status = 'reminded', reminder_sent_at = NOW() WHERE id = $1`,
        [apt.id]
      )
      await pool.query(
        `INSERT INTO automation_log (business_id, appointment_id, action_type, details)
         VALUES ($1, $2, 'reminder_sent', $3)`,
        [apt.business_id, apt.id, `Auto-Erinnerung an ${apt.phone_number}`]
      )
      sent++
    } catch (err) {
      errors.push(`${apt.id}: ${String(err)}`)
    }
  }

  return NextResponse.json({ sent, errors, total: appointments.length })
}
