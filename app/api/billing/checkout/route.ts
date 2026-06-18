import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, PRICE_IDS } from '@/lib/stripe'
import { PLANS, PlanKey } from '@/lib/plans'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const { plan } = await req.json() as { plan: PlanKey }
  if (!PLANS[plan]) {
    return NextResponse.json({ error: 'Ungültiger Plan' }, { status: 400 })
  }

  const bizResult = await pool.query(
    'SELECT * FROM businesses WHERE owner_email = $1',
    [session.user.email]
  )
  const business = bizResult.rows[0]
  if (!business) return NextResponse.json({ error: 'Business nicht gefunden' }, { status: 404 })

  // Stripe Customer anlegen oder wiederverwenden
  let customerId = business.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: business.name,
      metadata: { business_id: business.id },
    })
    customerId = customer.id
    await pool.query(
      'UPDATE businesses SET stripe_customer_id = $1 WHERE id = $2',
      [customerId, business.id]
    )
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?cancelled=1`,
    metadata: { business_id: business.id, plan },
    subscription_data: {
      metadata: { business_id: business.id, plan },
      trial_period_days: 14,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
