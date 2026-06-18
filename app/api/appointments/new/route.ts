import { NextRequest, NextResponse } from 'next/server'
import { getBusinessForSession } from '@/lib/get-business'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const business = await getBusinessForSession()
  if (!business) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { customer_name, phone_number, scheduled_date, scheduled_time, duration_minutes, price_value } = await req.json()

  if (!customer_name || !phone_number || !scheduled_date || !scheduled_time) {
    return NextResponse.json({ error: 'Alle Pflichtfelder ausfüllen' }, { status: 400 })
  }

  // Kunde anlegen oder wiederverwenden
  let customerResult = await pool.query(
    'SELECT id FROM customers WHERE business_id = $1 AND phone_number = $2',
    [business.id, phone_number]
  )

  let customerId: string
  if (customerResult.rows.length > 0) {
    customerId = customerResult.rows[0].id
    // Name aktualisieren falls geändert
    await pool.query(
      'UPDATE customers SET full_name = $1 WHERE id = $2',
      [customer_name, customerId]
    )
  } else {
    const newCustomer = await pool.query(
      'INSERT INTO customers (business_id, full_name, phone_number) VALUES ($1, $2, $3) RETURNING id',
      [business.id, customer_name, phone_number]
    )
    customerId = newCustomer.rows[0].id
  }

  const scheduledAt = new Date(`${scheduled_date}T${scheduled_time}:00`)

  const appointment = await pool.query(
    `INSERT INTO appointments (business_id, customer_id, scheduled_at, duration_minutes, price_value, status)
     VALUES ($1, $2, $3, $4, $5, 'scheduled') RETURNING id`,
    [business.id, customerId, scheduledAt.toISOString(), duration_minutes, price_value]
  )

  return NextResponse.json({ id: appointment.rows[0].id })
}
