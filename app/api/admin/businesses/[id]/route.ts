import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import pool from '@/lib/db'

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.email === process.env.ADMIN_EMAIL
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const result = await pool.query('SELECT * FROM businesses WHERE id = $1', [params.id])
  if (!result.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(result.rows[0])
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { name, owner_email, plan, address_street, address_zip, address_city, address_country, vat_number, phone } = await req.json()

  await pool.query(
    `UPDATE businesses SET
      name = $1, owner_email = $2, plan = $3,
      address_street = $4, address_zip = $5, address_city = $6,
      address_country = $7, vat_number = $8, phone = $9
     WHERE id = $10`,
    [name, owner_email, plan, address_street, address_zip, address_city, address_country, vat_number, phone, params.id]
  )

  return NextResponse.json({ ok: true })
}
