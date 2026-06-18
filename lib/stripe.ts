import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia' as any,
})

export const PLANS = {
  basis: {
    name: 'Basis',
    price: 29,
    priceId: process.env.STRIPE_PRICE_BASIS!,
    features: ['Bis 50 Termine/Monat', 'WhatsApp-Erinnerungen', 'Kundenverwaltung'],
  },
  pro: {
    name: 'Pro',
    price: 49,
    priceId: process.env.STRIPE_PRICE_PRO!,
    features: ['Unbegrenzte Termine', 'Wochenbericht', 'Umsatz-Tracker', 'Warteliste'],
  },
  premium: {
    name: 'Premium',
    price: 89,
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    features: ['Alles aus Pro', 'Eigenes WhatsApp-Branding', 'Mehrere Mitarbeiter', 'Priority Support'],
  },
} as const

export type PlanKey = keyof typeof PLANS
