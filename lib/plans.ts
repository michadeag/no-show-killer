export const PLANS = {
  basis: {
    name: 'Basis',
    price: 29,
    features: ['Bis 50 Termine/Monat', 'WhatsApp-Erinnerungen', 'Kundenverwaltung'],
  },
  pro: {
    name: 'Pro',
    price: 49,
    features: ['Unbegrenzte Termine', 'Wochenbericht', 'Umsatz-Tracker', 'Warteliste'],
  },
  premium: {
    name: 'Premium',
    price: 89,
    features: ['Alles aus Pro', 'Eigenes WhatsApp-Branding', 'Mehrere Mitarbeiter', 'Priority Support'],
  },
} as const

export type PlanKey = keyof typeof PLANS
