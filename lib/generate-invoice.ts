import PDFDocument from 'pdfkit'

type InvoiceData = {
  invoiceNumber: string
  invoiceDate: Date
  periodStart: Date
  periodEnd: Date
  plan: string
  amountCents: number
  business: {
    name: string
    owner_email: string
    address_street?: string
    address_zip?: string
    address_city?: string
    address_country?: string
    vat_number?: string
  }
}

const PLAN_LABELS: Record<string, string> = {
  basis: 'Basis-Plan',
  pro: 'Pro-Plan',
  premium: 'Premium-Plan',
}

const GREEN = '#1D9E75'

function formatDate(d: Date) {
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const netCents = Math.round(data.amountCents / 1.19)
    const vatCents = data.amountCents - netCents
    const hasVat = !data.business.vat_number

    // Header
    doc.fontSize(20).fillColor(GREEN).text('No-Show-Killer', 50, 50)
    doc.fontSize(9).fillColor('#888').text('terminsicher.app', 50, 74)

    // Sender address (small, above recipient)
    doc.fontSize(8).fillColor('#555')
      .text('No-Show-Killer · Musterstraße 1 · 12345 Musterstadt', 50, 110)

    // Recipient
    doc.fontSize(11).fillColor('#111')
      .text(data.business.name, 50, 130)
      .text(data.business.owner_email, 50, 145)

    if (data.business.address_street) {
      doc.text(data.business.address_street, 50, 160)
      doc.text(`${data.business.address_zip ?? ''} ${data.business.address_city ?? ''}`, 50, 175)
      doc.text(data.business.address_country ?? 'Deutschland', 50, 190)
    }

    if (data.business.vat_number) {
      doc.fontSize(9).fillColor('#555').text(`USt-ID: ${data.business.vat_number}`, 50, 210)
    }

    // Invoice meta (right side)
    doc.fontSize(10).fillColor('#111')
      .text('Rechnungsnummer:', 350, 130).text(data.invoiceNumber, 470, 130)
      .text('Rechnungsdatum:', 350, 145).text(formatDate(data.invoiceDate), 470, 145)
      .text('Leistungszeitraum:', 350, 160)
      .text(`${formatDate(data.periodStart)} – ${formatDate(data.periodEnd)}`, 350, 175)

    // Title
    doc.moveDown(6)
    doc.fontSize(16).fillColor('#111').text('Rechnung', 50)
    doc.moveDown(0.5)

    // Table header
    const tableTop = doc.y
    doc.fontSize(9).fillColor('#fff')
    doc.rect(50, tableTop, 495, 22).fill(GREEN)
    doc.fillColor('#fff')
      .text('Beschreibung', 58, tableTop + 6)
      .text('Zeitraum', 260, tableTop + 6)
      .text('Betrag (netto)', 420, tableTop + 6)

    // Table row
    const rowTop = tableTop + 22
    doc.rect(50, rowTop, 495, 28).fill('#f9fafb')
    doc.fontSize(10).fillColor('#111')
      .text(PLAN_LABELS[data.plan] ?? data.plan, 58, rowTop + 8)
      .text(`${formatDate(data.periodStart)} – ${formatDate(data.periodEnd)}`, 260, rowTop + 8)
      .text(`${(netCents / 100).toFixed(2)} €`, 420, rowTop + 8)

    // Totals
    const totalsTop = rowTop + 50
    doc.fontSize(10).fillColor('#555')

    if (hasVat) {
      doc.text('Nettobetrag:', 350, totalsTop)
        .fillColor('#111').text(`${(netCents / 100).toFixed(2)} €`, 470, totalsTop)
      doc.fillColor('#555').text('MwSt. 19%:', 350, totalsTop + 18)
        .fillColor('#111').text(`${(vatCents / 100).toFixed(2)} €`, 470, totalsTop + 18)
      doc.moveTo(350, totalsTop + 38).lineTo(545, totalsTop + 38).strokeColor('#ddd').stroke()
      doc.fontSize(12).fillColor(GREEN).font('Helvetica-Bold')
        .text('Gesamtbetrag:', 350, totalsTop + 44)
        .text(`${(data.amountCents / 100).toFixed(2)} €`, 470, totalsTop + 44)
    } else {
      doc.text('Nettobetrag:', 350, totalsTop)
        .fillColor('#111').text(`${(data.amountCents / 100).toFixed(2)} €`, 470, totalsTop)
      doc.fillColor('#555').text('MwSt.: Steuerfreie innergemeinschaftliche Leistung', 58, totalsTop + 18)
      doc.moveTo(350, totalsTop + 38).lineTo(545, totalsTop + 38).strokeColor('#ddd').stroke()
      doc.fontSize(12).fillColor(GREEN).font('Helvetica-Bold')
        .text('Gesamtbetrag:', 350, totalsTop + 44)
        .text(`${(data.amountCents / 100).toFixed(2)} €`, 470, totalsTop + 44)
    }

    // Footer
    doc.fontSize(8).fillColor('#999').font('Helvetica')
      .text('Zahlung erfolgte per SEPA-Lastschrift / Kreditkarte über Stripe.', 50, 720)
      .text('Bei Fragen: support@terminsicher.app', 50, 732)

    doc.end()
  })
}
