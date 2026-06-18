import { NextRequest, NextResponse } from 'next/server'
import { getBusinessForSession } from '@/lib/get-business'
import pool from '@/lib/db'
import { sendWhatsAppMessage, buildReminderMessage } from '@/lib/whatsapp'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const business = await getBusinessForSession()
  if (!business) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { action } = await req.json()

  // Termin gehört zum Business des eingeloggten Nutzers?
  const aptResult = await pool.query(
    `SELECT a.*, c.full_name, c.phone_number
     FROM appointments a
     JOIN customers c ON c.id = a.customer_id
     WHERE a.id = $1 AND a.business_id = $2`,
    [params.id, business.id]
  )
  const apt = aptResult.rows[0]
  if (!apt) return NextResponse.json({ error: 'Termin nicht gefunden' }, { status: 404 })

  switch (action) {
    case 'remind': {
      const message = buildReminderMessage(apt.full_name, apt.scheduled_at)
      try {
        await sendWhatsAppMessage(apt.phone_number, message)
      } catch (err) {
        console.error('[Twilio Error]', err)
        return NextResponse.json({ error: String(err) }, { status: 500 })
      }
      await pool.query(
        `UPDATE appointments SET status = 'reminded', reminder_sent_at = NOW() WHERE id = $1`,
        [params.id]
      )
      await pool.query(
        `INSERT INTO automation_log (business_id, appointment_id, action_type, details)
         VALUES ($1, $2, 'reminder_sent', $3)`,
        [business.id, params.id, `Erinnerung an ${apt.phone_number}`]
      )
      return NextResponse.json({ status: 'reminded' })
    }

    case 'confirm': {
      await pool.query(
        `UPDATE appointments SET status = 'confirmed', confirmed_at = NOW() WHERE id = $1`,
        [params.id]
      )
      await pool.query(
        `INSERT INTO automation_log (business_id, appointment_id, action_type, details)
         VALUES ($1, $2, 'confirmation_received', 'Manuell bestätigt')`,
        [business.id, params.id]
      )
      return NextResponse.json({ status: 'confirmed' })
    }

    case 'no_show': {
      await pool.query(
        `UPDATE appointments SET status = 'no_show' WHERE id = $1`,
        [params.id]
      )
      // Warteliste prüfen
      const waitlist = await pool.query(
        'SELECT w.*, c.full_name, c.phone_number FROM waitlist w JOIN customers c ON c.id = w.customer_id WHERE w.business_id = $1 LIMIT 1',
        [business.id]
      )
      if (waitlist.rows.length > 0) {
        const next = waitlist.rows[0]
        await sendWhatsAppMessage(next.phone_number, `Hallo ${next.full_name}, es ist ein Termin frei geworden! Melde dich um ihn zu buchen.`)
        await pool.query(
          `INSERT INTO automation_log (business_id, appointment_id, action_type, details)
           VALUES ($1, $2, 'waitlist_contacted', $3)`,
          [business.id, params.id, `Warteliste kontaktiert: ${next.full_name}`]
        )
      }
      return NextResponse.json({ status: 'no_show' })
    }

    default:
      return NextResponse.json({ error: 'Unbekannte Aktion' }, { status: 400 })
  }
}
