import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

type Params = Promise<{ slug: string }>

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { slug } = await params
  const businessRes = await pool.query(
    'SELECT id, branding_name, name, phone FROM businesses WHERE id = $1',
    [slug]
  )
  if (!businessRes.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const b = businessRes.rows[0]

  const settingsRes = await pool.query('SELECT * FROM availability_settings WHERE business_id = $1', [b.id])
  const settings = settingsRes.rows[0]

  return NextResponse.json({
    id: b.id,
    name: b.branding_name || b.name,
    phone: b.phone,
    active: settings?.booking_active ?? false,
    slot_duration_minutes: settings?.slot_duration_minutes ?? 60,
    max_days_ahead: settings?.max_days_ahead ?? 30,
  })
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { slug } = await params
  const { date, time, name, phone } = await req.json()

  if (!date || !time || !name || !phone) {
    return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 })
  }

  const businessRes = await pool.query('SELECT * FROM businesses WHERE id = $1', [slug])
  if (!businessRes.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const business = businessRes.rows[0]

  const settingsRes = await pool.query('SELECT * FROM availability_settings WHERE business_id = $1', [business.id])
  const settings = settingsRes.rows[0]
  if (!settings?.booking_active) return NextResponse.json({ error: 'Buchung nicht aktiv' }, { status: 400 })

  const scheduledAt = new Date(`${date}T${time}:00`)

  // Upsert customer
  const customerRes = await pool.query(`
    INSERT INTO customers (business_id, full_name, phone_number)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
    RETURNING id
  `, [business.id, name.trim(), phone.trim()])

  let customerId: string
  if (customerRes.rows.length) {
    customerId = customerRes.rows[0].id
  } else {
    const existing = await pool.query(
      'SELECT id FROM customers WHERE business_id = $1 AND phone_number = $2',
      [business.id, phone.trim()]
    )
    if (!existing.rows.length) {
      const inserted = await pool.query(
        'INSERT INTO customers (business_id, full_name, phone_number) VALUES ($1, $2, $3) RETURNING id',
        [business.id, name.trim(), phone.trim()]
      )
      customerId = inserted.rows[0].id
    } else {
      customerId = existing.rows[0].id
    }
  }

  const apptRes = await pool.query(`
    INSERT INTO appointments (business_id, customer_id, scheduled_at, duration_minutes, status)
    VALUES ($1, $2, $3, $4, 'scheduled')
    RETURNING id
  `, [business.id, customerId, scheduledAt, settings.slot_duration_minutes])

  const apptId = apptRes.rows[0].id

  // Send WhatsApp confirmation
  const formatted = scheduledAt.toLocaleString('de-DE', {
    weekday: 'long', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Berlin',
  })
  const businessName = business.branding_name || business.name
  try {
    await sendWhatsAppMessage(
      phone.trim(),
      `Hallo ${name} 👋\n\nDein Termin bei *${businessName}* wurde bestätigt:\n📅 *${formatted} Uhr*\n\nWir freuen uns auf dich! Bei Fragen: ${business.phone || ''}`
    )
  } catch (e) {
    console.error('WhatsApp confirmation failed:', e)
  }

  return NextResponse.json({ ok: true, id: apptId })
}
