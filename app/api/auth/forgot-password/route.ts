import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import pool from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'E-Mail fehlt' }, { status: 400 })

  const user = await pool.query('SELECT id FROM users WHERE email = $1', [email])

  // Immer OK zurückgeben — kein Hinweis ob E-Mail existiert
  if (!user.rows[0]) return NextResponse.json({ ok: true })

  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 Stunde

  await pool.query(
    `INSERT INTO password_reset_tokens (token, user_id, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (token) DO NOTHING`,
    [token, user.rows[0].id, expires]
  )

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'onboarding@resend.dev',
    to: email,
    subject: 'Passwort zurücksetzen – No-Show-Killer',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#1D9E75">Passwort zurücksetzen</h2>
        <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>
        <p>Klicke auf den Button um ein neues Passwort zu setzen. Der Link ist <strong>1 Stunde</strong> gültig.</p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Passwort zurücksetzen →
        </a>
        <p style="color:#999;font-size:12px">Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
