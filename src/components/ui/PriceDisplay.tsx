export function formatZAR(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return 'R 0.00'
  const fixed = num.toFixed(2)
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `R ${parts.join('.')}`
}

export default function PriceDisplay({ price, className = '' }: { price: number; className?: string }) {
  return <span className={className}>{formatZAR(price)}</span>
}
