import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

type Params = Promise<{ slug: string }>

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { slug } = await params
  const dateStr = req.nextUrl.searchParams.get('date')
  if (!dateStr) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const businessRes = await pool.query('SELECT * FROM businesses WHERE id = $1', [slug])
  if (!businessRes.rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const business = businessRes.rows[0]

  const settingsRes = await pool.query('SELECT * FROM availability_settings WHERE business_id = $1', [business.id])
  const settings = settingsRes.rows[0]
  if (!settings || !settings.booking_active) return NextResponse.json({ slots: [] })

  const date = new Date(dateStr + 'T00:00:00')
  const jsWeekday = date.getDay() // 0=Sunday
  const weekday = jsWeekday === 0 ? 6 : jsWeekday - 1 // convert to 0=Monday

  const wdRes = await pool.query(
    'SELECT * FROM availability_weekdays WHERE business_id = $1 AND weekday = $2',
    [business.id, weekday]
  )
  const wd = wdRes.rows[0]
  if (!wd || !wd.is_open) return NextResponse.json({ slots: [] })

  // Generate all slots for the day
  const [openH, openM] = wd.open_time.split(':').map(Number)
  const [closeH, closeM] = wd.close_time.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  const duration = settings.slot_duration_minutes

  const breakStart = wd.break_start ? wd.break_start.split(':').map(Number) : null
  const breakEnd = wd.break_end ? wd.break_end.split(':').map(Number) : null
  const breakStartMin = breakStart ? breakStart[0] * 60 + breakStart[1] : null
  const breakEndMin = breakEnd ? breakEnd[0] * 60 + breakEnd[1] : null

  const slots: string[] = []
  for (let m = openMinutes; m + duration <= closeMinutes; m += duration) {
    // Skip break time
    if (breakStartMin !== null && breakEndMin !== null) {
      if (m < breakEndMin && m + duration > breakStartMin) continue
    }
    const h = Math.floor(m / 60)
    const min = m % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }

  // Filter by min_advance_hours
  const minTime = new Date(Date.now() + settings.min_advance_hours * 3600000)
  const available = slots.filter(slot => {
    const [h, m] = slot.split(':').map(Number)
    const slotDate = new Date(dateStr + 'T00:00:00')
    slotDate.setHours(h, m, 0, 0)
    return slotDate > minTime
  })

  // Remove booked slots
  const dayStart = dateStr + 'T00:00:00'
  const dayEnd = dateStr + 'T23:59:59'
  const bookedRes = await pool.query(
    `SELECT scheduled_at, duration_minutes FROM appointments
     WHERE business_id = $1 AND scheduled_at BETWEEN $2 AND $3
     AND status NOT IN ('cancelled', 'no_show')`,
    [business.id, dayStart, dayEnd]
  )

  const freeSlots = available.filter(slot => {
    const [h, m] = slot.split(':').map(Number)
    const slotStart = new Date(dateStr + 'T00:00:00')
    slotStart.setHours(h, m, 0, 0)
    const slotEnd = new Date(slotStart.getTime() + duration * 60000)

    return !bookedRes.rows.some(appt => {
      const apptStart = new Date(appt.scheduled_at)
      const apptEnd = new Date(apptStart.getTime() + appt.duration_minutes * 60000)
      return slotStart < apptEnd && slotEnd > apptStart
    })
  })

  return NextResponse.json({ slots: freeSlots })
}
