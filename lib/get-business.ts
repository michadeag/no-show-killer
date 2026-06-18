import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import pool from './db'

export async function getBusinessForSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const result = await pool.query(
    'SELECT * FROM businesses WHERE owner_email = $1',
    [session.user.email]
  )
  return result.rows[0] ?? null
}
