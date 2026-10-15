// Field-level translation: every text field an editor writes copy into
// becomes an English + Swedish pair, side by side in Studio, stored as
// { en, sv }. The site resolves those pairs with localize()
// (src/lib/i18n/localize.ts), English filling in for an empty Swedish box.
//
// Done as one transform over the schema rather than by hand in each
// block, so a new block's text fields are translatable automatically.
// A text field is left alone when it isn't copy: a pick-list (options.list),
// a link (name ending in "href"), or one of SKIP_NAMES. A field can also
// opt out explicitly with `options: { localize: false }`.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Def = Record<string, any>

export const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'sv', title: 'Swedish' },
] as const

const TEXT_TYPES = new Set(['string', 'text'])

// Text fields that hold identifiers, not copy.
const SKIP_NAMES = new Set(['anchor', 'logoText', 'note', 'language'])

export function isLocalizableField(field: Def): boolean {
  if (!TEXT_TYPES.has(field.type)) return false
  if (field.options?.list || field.options?.localize === false) return false
  if (/href$/i.test(field.name ?? '')) return false
  return !SKIP_NAMES.has(field.name)
}

// The parts of a field that stay on the outer pair; everything else
// (type, rows, validation…) describes the text box itself.
const OUTER_KEYS = ['name', 'title', 'description', 'group', 'fieldset', 'hidden', 'readOnly', 'deprecated'] as const

function pairField(field: Def): Def {
  const outer: Def = {}
  for (const key of OUTER_KEYS) if (field[key] !== undefined) outer[key] = field[key]
  const box = (language: (typeof LANGUAGES)[number], isDefault: boolean): Def => ({
    name: language.id,
    title: language.title,
    type: field.type,
    ...(field.rows ? { rows: field.rows } : {}),
    ...(field.placeholder ? { placeholder: field.placeholder } : {}),
    // English keeps the field's own rules (required, max length…).
    // Swedish has none: it's optional, and an empty box shows the
    // English on the site.
    ...(isDefault && field.validation ? { validation: field.validation } : {}),
  })
  return {
    ...outer,
    type: 'object',
    options: { columns: 2, collapsible: false },
    fields: LANGUAGES.map((language, i) => box(language, i === 0)),
    ...(field.initialValue !== undefined ? { initialValue: { en: field.initialValue } } : {}),
  }
}

// A list of plain strings (Pricing's plan features) becomes a list of
// English/Swedish pairs.
function pairMember(member: Def): Def {
  const pair = pairField({ ...member, name: undefined })
  delete pair.name
  return {
    ...pair,
    ...(member.title ? { title: member.title } : {}),
    preview: { select: { title: 'en', subtitle: 'sv' } },
  }
}

// Every type definition by name, so a preview path can be followed into
// a named type (e.g. "media.alt" goes into the `media` type).
type Registry = Map<string, Def>

function fieldsOf(def: Def | undefined, registry: Registry): Def[] | undefined {
  if (!def) return undefined
  if (def.fields) return def.fields
  return registry.get(def.type)?.fields
}

// Does this dotted preview path ("items.0.label", "media.alt") end on a
// field that is now an English/Swedish pair? Followed through the
// ORIGINAL definitions.
function endsOnLocalized(path: string, fields: Def[] | undefined, registry: Registry): boolean {
  const [head, ...rest] = path.split('.')
  const field = fields?.find((f) => f.name === head)
  if (!field) return false
  if (rest.length === 0) return isLocalizableField(field)
  if (field.type === 'array') {
    // Skip the index segment ("0") and look inside the array's members.
    const after = /^\d+$/.test(rest[0]) ? rest.slice(1) : rest
    if (after.length === 0) {
      return (field.of ?? []).some((m: Def) => TEXT_TYPES.has(m.type) && !m.options?.list)
    }
    return (field.of ?? []).some((m: Def) => endsOnLocalized(after.join('.'), fieldsOf(m, registry), registry))
  }
  return endsOnLocalized(rest.join('.'), fieldsOf(field, registry), registry)
}

// A preview that selects a text field now needs its English value
// ("heading" → "heading.en"), or the preview would get an object.
function fixPreview(preview: Def | undefined, fields: Def[] | undefined, registry: Registry): Def | undefined {
  if (!preview?.select) return preview
  const select: Def = {}
  for (const [key, path] of Object.entries(preview.select as Record<string, string>)) {
    select[key] = endsOnLocalized(path, fields, registry) ? `${path}.en` : path
  }
  return { ...preview, select }
}

function localizeField(field: Def, registry: Registry): Def {
  if (isLocalizableField(field)) return pairField(field)
  if (field.fields) {
    return {
      ...field,
      fields: field.fields.map((f: Def) => localizeField(f, registry)),
      ...(field.preview ? { preview: fixPreview(field.preview, field.fields, registry) } : {}),
    }
  }
  if (field.type === 'array' && field.of) {
    return {
      ...field,
      of: field.of.map((member: Def) => {
        if (isLocalizableField({ ...member, name: member.name ?? '' })) return pairMember(member)
        return localizeField(member, registry)
      }),
    }
  }
  return field
}

// Applies the transform to the named types in `names`; every other type
// passes through unchanged.
export function localizeSchemaTypes<T extends Def>(types: T[], names: Set<string>): T[] {
  const registry: Registry = new Map(types.map((type) => [type.name, type]))
  return types.map((type) => (names.has(type.name) ? (localizeField(type, registry) as T) : type))
}
