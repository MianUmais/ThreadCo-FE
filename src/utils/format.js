const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(priceCents) {
  return USD.format(priceCents / 100)
}
