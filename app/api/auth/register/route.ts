import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const { name, email, password, businessName } = await req.json()

  if (!name || !email || !password || !businessName) {
    return NextResponse.json({ error: 'Alle Felder ausfüllen' }, { status: 400 })
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'E-Mail bereits registriert' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const userResult = await client.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hash]
    )
    const userId = userResult.rows[0].id
    await client.query(
      'INSERT INTO businesses (user_id, name, owner_email, plan) VALUES ($1, $2, $3, $4)',
      [userId, businessName, email, 'pro'] // Demo: direkt Pro-Plan
    )
    await client.query('COMMIT')
  } catch {
    await client.query('ROLLBACK')
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen' }, { status: 500 })
  } finally {
    client.release()
  }

  return NextResponse.json({ success: true })
}
