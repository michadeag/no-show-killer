import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password) return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: 'Passwort zu kurz (min. 8 Zeichen)' }, { status: 400 })

  const result = await pool.query(
    `SELECT * FROM password_reset_tokens
     WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()`,
    [token]
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Link ungültig oder abgelaufen' }, { status: 400 })
  }

  const { user_id } = result.rows[0]
  const hash = await bcrypt.hash(password, 12)

  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hash, user_id])
  await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE token = $1', [token])

  return NextResponse.json({ ok: true })
}
