// The products a story names ("Audit + Analytics") as separate filter
// values (["Audit", "Analytics"]).
export function splitProducts(products?: string): string[] {
  return (products ?? '')
    .split(/[+,&]/)
    .map((product) => product.trim())
    .filter(Boolean)
}
