// Einmalig ausführen: npx ts-node scripts/setup-stripe.ts
// Legt die 3 Abo-Produkte in Stripe an und gibt die Preis-IDs aus

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

async function main() {
  const plans = [
    { name: 'No-Show-Killer Basis', amount: 2900, key: 'basis' },
    { name: 'No-Show-Killer Pro', amount: 4900, key: 'pro' },
    { name: 'No-Show-Killer Premium', amount: 8900, key: 'premium' },
  ]

  for (const plan of plans) {
    const product = await stripe.products.create({ name: plan.name })
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: 'eur',
      recurring: { interval: 'month' },
    })
    console.log(`${plan.key.toUpperCase()}: ${price.id}`)
  }
}

main().catch(console.error)
