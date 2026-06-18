// Server-only — nur in API Routes importieren
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia' as any,
})

export const PRICE_IDS = {
  basis: process.env.STRIPE_PRICE_BASIS!,
  pro: process.env.STRIPE_PRICE_PRO!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
}
