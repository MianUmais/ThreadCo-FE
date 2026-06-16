const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const DATE_FMT = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export function formatPrice(priceCents) {
  return USD.format(priceCents / 100)
}

export function formatDate(isoString) {
  return DATE_FMT.format(new Date(isoString))
}
