import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const bizResult = await pool.query(
    'SELECT stripe_customer_id FROM businesses WHERE owner_email = $1',
    [session.user.email]
  )
  const business = bizResult.rows[0]
  if (!business?.stripe_customer_id) {
    return NextResponse.json({ error: 'Kein Stripe-Konto gefunden' }, { status: 404 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: business.stripe_customer_id,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
  })

  return NextResponse.json({ url: portalSession.url })
}
