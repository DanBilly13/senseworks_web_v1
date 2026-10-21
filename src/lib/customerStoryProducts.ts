// A story's products are stored as values ("audit", "analytics"); these
// are the names shown for them, as in the menu: Audit / Analytics,
// Revision / Analys on Swedish pages.
const PRODUCT_LABEL: Record<string, { en: string; sv: string }> = {
  audit: { en: 'Audit', sv: 'Revision' },
  analytics: { en: 'Analytics', sv: 'Analys' },
}

export function productLabels(products?: string[], locale = 'en'): string[] {
  const lang = locale === 'sv' ? 'sv' : 'en'
  return (products ?? []).map((product) => PRODUCT_LABEL[product]?.[lang] ?? product)
}
