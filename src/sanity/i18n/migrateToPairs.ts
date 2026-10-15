// One-off content migration for field-level translation: walks a
// document alongside its (already localized) schema and moves every
// plain-string value of a field that is now an English/Swedish pair into
// that pair's English box. Values already in pairs are left alone, so
// running it twice is harmless.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Def = Record<string, any>
type Registry = Map<string, Def>

const isPair = (def: Def) =>
  def.type === 'object' && def.fields?.length === 2 && def.fields[0].name === 'en' && def.fields[1].name === 'sv'

const randomKey = () => Math.random().toString(36).slice(2, 10)

function fieldsOf(def: Def, registry: Registry): Def[] | undefined {
  return def.fields ?? registry.get(def.type)?.fields
}

function migrateValue(value: any, def: Def, registry: Registry): any {
  if (value === undefined || value === null) return value
  if (isPair(def)) return typeof value === 'string' ? { en: value } : value
  const resolved = def.fields || def.of ? def : (registry.get(def.type) ?? def)
  if (resolved.type === 'array' && Array.isArray(value)) {
    return value.map((item) => {
      const member =
        typeof item === 'string'
          ? resolved.of.find((m: Def) => isPair(m))
          : (resolved.of.find((m: Def) => item?._type && (m.name === item._type || m.type === item._type)) ??
            resolved.of.find((m: Def) => m.fields))
      if (!member) return item
      if (typeof item === 'string') return { _key: randomKey(), en: item }
      return migrateValue(item, member, registry)
    })
  }
  const fields = fieldsOf(resolved, registry)
  if (fields && typeof value === 'object' && !Array.isArray(value)) {
    const out = { ...value }
    for (const field of fields) {
      if (field.name in out) out[field.name] = migrateValue(out[field.name], field, registry)
    }
    return out
  }
  return value
}

export function migrateDocument<T extends { _type: string }>(doc: T, schemaTypes: Def[]): T {
  const registry: Registry = new Map(schemaTypes.map((type) => [type.name, type]))
  const def = registry.get(doc._type)
  return def ? migrateValue(doc, def, registry) : doc
}
