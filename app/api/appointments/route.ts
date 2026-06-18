import { NextResponse } from 'next/server'
import { getBusinessForSession } from '@/lib/get-business'
import pool from '@/lib/db'

export async function GET() {
  const business = await getBusinessForSession()
  if (!business) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const result = await pool.query(
    `SELECT a.*, c.full_name as customer_name, c.phone_number
     FROM appointments a
     JOIN customers c ON c.id = a.customer_id
     WHERE a.business_id = $1
     ORDER BY a.scheduled_at DESC`,
    [business.id]
  )

  return NextResponse.json(result.rows)
}
