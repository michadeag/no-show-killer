import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import pool from '@/lib/db'
import { sendPaymentSuccessEmail, sendPaymentFailedEmail, sendWelcomeEmail, sendInvoiceEmail } from '@/lib/email'
import { generateInvoicePDF } from '@/lib/generate-invoice'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature ungültig' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const businessId = session.metadata?.business_id
      const plan = session.metadata?.plan
      if (!businessId || !plan) break

      await pool.query(
        `UPDATE businesses SET
          plan = $1,
          stripe_subscription_id = $2,
          subscription_status = 'active'
         WHERE id = $3`,
        [plan, session.subscription, businessId]
      )

      const biz = await pool.query('SELECT name, owner_email FROM businesses WHERE id = $1', [businessId])
      if (biz.rows[0]) {
        await sendWelcomeEmail(biz.rows[0].owner_email, biz.rows[0].name, plan)
      }
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const biz = await pool.query(
        'SELECT * FROM businesses WHERE stripe_customer_id = $1',
        [customerId]
      )
      if (!biz.rows[0]) break

      const business = biz.rows[0]

      const periodStart = new Date((invoice as any).period_start * 1000)
      const periodEnd = new Date((invoice as any).period_end * 1000)

      // Prüfen ob Rechnung schon existiert (Webhook-Retry-Schutz)
      const existing = await pool.query(
        'SELECT invoice_number FROM invoices WHERE stripe_invoice_id = $1',
        [invoice.id]
      )
      const isRetry = existing.rows.length > 0
      const invoiceNumber = isRetry
        ? existing.rows[0].invoice_number
        : `NSK-${new Date().getFullYear()}-${String((await pool.query('SELECT COUNT(*) FROM invoices WHERE business_id = $1', [business.id])).rows[0].count * 1 + 1).padStart(4, '0')}`

      await pool.query(
        `INSERT INTO invoices (business_id, stripe_invoice_id, amount_cents, status, paid_at, invoice_number, plan, period_start, period_end)
         VALUES ($1, $2, $3, 'paid', NOW(), $4, $5, $6, $7)
         ON CONFLICT (stripe_invoice_id) DO UPDATE SET status = 'paid', paid_at = NOW()`,
        [business.id, invoice.id, invoice.amount_paid, invoiceNumber, business.plan, periodStart, periodEnd]
      )

      await pool.query(
        `UPDATE businesses SET subscription_status = 'active',
         current_period_end = to_timestamp($1)
         WHERE stripe_customer_id = $2`,
        [(invoice as any).period_end, customerId]
      )

      // PDF nur beim ersten Mal generieren und senden
      if (!isRetry) {
        try {
          const pdfBuffer = await generateInvoicePDF({
            invoiceNumber,
            invoiceDate: new Date(),
            periodStart,
            periodEnd,
            plan: business.plan,
            amountCents: invoice.amount_paid,
            business,
          })
          await sendInvoiceEmail(business.owner_email, business.name, invoiceNumber, pdfBuffer)
        } catch (err) {
          console.error('[Invoice PDF Error]', err)
        }
      }

      if (invoice.billing_reason !== 'subscription_create') {
        await sendPaymentSuccessEmail(business.owner_email, business.name, Math.round(invoice.amount_paid / 100), business.plan)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const biz = await pool.query(
        'SELECT id, name, owner_email FROM businesses WHERE stripe_customer_id = $1',
        [customerId]
      )
      if (!biz.rows[0]) break

      const business = biz.rows[0]
      const amount = Math.round(invoice.amount_due / 100)

      await pool.query(
        `INSERT INTO invoices (business_id, stripe_invoice_id, amount_cents, status, due_date)
         VALUES ($1, $2, $3, 'failed', NOW())
         ON CONFLICT (stripe_invoice_id) DO UPDATE SET status = 'failed'`,
        [business.id, invoice.id, invoice.amount_due]
      )

      await pool.query(
        "UPDATE businesses SET subscription_status = 'past_due' WHERE stripe_customer_id = $1",
        [customerId]
      )

      await sendPaymentFailedEmail(business.owner_email, business.name, amount)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await pool.query(
        "UPDATE businesses SET subscription_status = 'cancelled', plan = 'basis' WHERE stripe_subscription_id = $1",
        [sub.id]
      )
      break
    }
  }

  return NextResponse.json({ received: true })
}
