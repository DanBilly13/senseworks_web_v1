// A story's products are stored as values ("audit", "analytics"); these
// are the names shown for them (the product names are the same on
// Swedish pages, as in the menu).
const PRODUCT_LABEL: Record<string, string> = {
  audit: 'Audit',
  analytics: 'Analytics',
}

export function productLabels(products?: string[]): string[] {
  return (products ?? []).map((product) => PRODUCT_LABEL[product] ?? product)
}
