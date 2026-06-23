import { NextRequest, NextResponse } from 'next/server'
import { getBusinessForSession } from '@/lib/get-business'
import pool from '@/lib/db'

const DEFAULT_WEEKDAYS = [0,1,2,3,4,5,6].map(d => ({
  weekday: d,
  is_open: d < 5,
  open_time: '09:00',
  close_time: '18:00',
  break_start: null,
  break_end: null,
}))

export async function GET() {
  const business = await getBusinessForSession()
  if (!business) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [settingsRes, weekdaysRes] = await Promise.all([
    pool.query('SELECT * FROM availability_settings WHERE business_id = $1', [business.id]),
    pool.query('SELECT * FROM availability_weekdays WHERE business_id = $1 ORDER BY weekday', [business.id]),
  ])

  const settings = settingsRes.rows[0] || {
    slot_duration_minutes: 60,
    min_advance_hours: 2,
    max_days_ahead: 30,
    booking_active: true,
  }

  const weekdays = weekdaysRes.rows.length > 0
    ? weekdaysRes.rows
    : DEFAULT_WEEKDAYS

  return NextResponse.json({
    ...settings,
    business_id: business.id,
    weekdays,
  })
}

export async function PATCH(req: NextRequest) {
  const business = await getBusinessForSession()
  if (!business) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { slot_duration_minutes, min_advance_hours, max_days_ahead, booking_active, weekdays } = body

  await pool.query(`
    INSERT INTO availability_settings (business_id, slot_duration_minutes, min_advance_hours, max_days_ahead, booking_active)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (business_id) DO UPDATE SET
      slot_duration_minutes = $2,
      min_advance_hours = $3,
      max_days_ahead = $4,
      booking_active = $5
  `, [business.id, slot_duration_minutes, min_advance_hours, max_days_ahead, booking_active])

  if (weekdays && Array.isArray(weekdays)) {
    for (const wd of weekdays) {
      await pool.query(`
        INSERT INTO availability_weekdays (business_id, weekday, is_open, open_time, close_time, break_start, break_end)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (business_id, weekday) DO UPDATE SET
          is_open = $3, open_time = $4, close_time = $5, break_start = $6, break_end = $7
      `, [business.id, wd.weekday, wd.is_open, wd.open_time, wd.close_time, wd.break_start || null, wd.break_end || null])
    }
  }

  return NextResponse.json({ ok: true })
}
