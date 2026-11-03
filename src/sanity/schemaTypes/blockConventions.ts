// House rules for every page block in Studio (see STUDIO-CONVENTIONS.md),
// applied as one transform over the block types, like localizeSchema —
// so each block gets them without repeating them, and a new block gets
// them automatically:
//
// - Two tabs: Content (the copy, in reading order) and Design (the
//   settings, in a fixed order). "Hide block" sits in both.
// - Bigger text boxes: headlines 2 lines (and Enter makes a line
//   break), body text 5, card/item text 4.
// - "Headline" and "Body" for the heading and the text under it.
// - No "(default)" in option labels: Studio already shows the default
//   picked when a block is added.
// - Standard help text for the shared settings, where a block hasn't
//   written its own.
//
// Only how Studio shows the fields changes; field names and stored
// values stay as they are, so no content needs migrating.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Def = Record<string, any>

export const BLOCK_GROUPS = [
  { name: 'content', title: 'Content', default: true },
  { name: 'design', title: 'Design' },
]

// Pick-lists that choose content rather than style.
const CONTENT_LISTS = new Set(['source', 'stages', 'count', 'productFilter'])
// Media that's part of the look, shown with the background setting.
const DESIGN_MEDIA = new Set(['backgroundImage'])

export const isDesignField = (field: Def) =>
  field.name !== 'hidden' &&
  !CONTENT_LISTS.has(field.name) &&
  (Boolean(field.options?.list) || field.type === 'boolean' || DESIGN_MEDIA.has(field.name) || field.name === 'anchor')

// Content in reading order; anything not listed (items, cards, slides…)
// comes after, in the order the block declares it.
const CONTENT_ORDER = [
  'eyebrow',
  'headline',
  'subhead',
  'body',
  'text',
  'closingText',
  'ctaLabel',
  'ctaHref',
  'secondaryCtaLabel',
  'secondaryCtaHref',
  'ctaNote',
  'media',
  'media2',
  'secondMedia',
  'leftImage',
  'showcaseMedia',
]

// Design: what the block is, then type, then images, then colour, then
// width, then the space inside and after it. Anything not listed comes
// in the middle, in the order the block declares it.
const DESIGN_ORDER = [
  'layout',
  'style',
  'columns',
  'headlineSize',
  'typingHeadline',
  'headlineColor',
  'titleSize',
  'headingLayout',
  '*',
  'imagePosition',
  'mediaPosition',
  'imageRatio',
  'tone',
  'background',
  'backgroundType',
  'backgroundColor',
  'backgroundImage',
  'textTone',
  'align',
  'width',
  'anchor',
  'paddingTop',
  'paddingBottom',
  'spaceBelow',
  'boundary',
  'spacing',
]

const rank = (order: string[], name: string) => {
  const i = order.indexOf(name)
  return i === -1 ? (order.includes('*') ? order.indexOf('*') : order.length) : i
}

const HEADLINE_NAMES = new Set(['headline'])

// The same name for the same field on every block, where the block
// hasn't given it one (Studio would otherwise show "Cta Label").
const TITLES: Record<string, string> = {
  eyebrow: 'Eyebrow',
  body: 'Body',
  text: 'Text',
  ctaLabel: 'Button text',
  ctaHref: 'Button link',
  secondaryCtaLabel: 'Second button text',
  secondaryCtaHref: 'Second button link',
  ctaNote: 'Button note',
}
const BODY_NAMES = new Set(['body', 'text', 'closingText'])

// Shared settings' help text, used where a block hasn't written its own.
const DESCRIPTIONS: Record<string, string> = {
  tone: 'The colour behind this block. On Dark (and the dark gradient) the text turns white.',
  titleSize: 'How big each card or item title is drawn.',
  imagePosition: 'Which side the image sits on, from tablet width up. On phones it always stacks.',
  columns: 'How many columns from desktop width; tablets and phones use fewer.',
  align: 'How the text lines up.',
  paddingTop: 'Space above the content, inside the background.',
  paddingBottom: 'Space below the content, inside the background.',
}

const stripDefault = (title: unknown) => (typeof title === 'string' ? title.replace(/\s*\(default\)/gi, '') : title)

function tidyOptions(field: Def): Def {
  if (!Array.isArray(field.options?.list)) return field
  return {
    ...field,
    options: {
      ...field.options,
      list: field.options.list.map((o: any) => (typeof o === 'object' && o ? { ...o, title: stripDefault(o.title) } : o)),
    },
  }
}

// Card/item text inside a block's lists: 4 lines.
function tidyMembers(field: Def): Def {
  if (field.type !== 'array' || !field.of) return field
  return {
    ...field,
    of: field.of.map((member: Def) =>
      member.fields
        ? {
            ...member,
            fields: member.fields.map((f: Def) =>
              tidyOptions(f.type === 'text' && !f.options?.localize ? { ...f, rows: Math.max(f.rows ?? 0, 4) } : f),
            ),
          }
        : member,
    ),
  }
}

function tidyField(field: Def): Def {
  let f = tidyMembers(tidyOptions(field))
  if (!f.title && TITLES[f.name]) f = { ...f, title: TITLES[f.name] }
  if (HEADLINE_NAMES.has(f.name)) {
    // A one-line box can't hold a line break: make it a text box (the
    // stored value is a plain string either way).
    f = { ...f, title: 'Headline', ...(f.type === 'string' ? { type: 'text' } : {}) }
    if (f.type === 'text') f = { ...f, rows: Math.max(f.rows ?? 0, 2) }
  } else if (BODY_NAMES.has(f.name) && (f.type === 'text' || f.type === 'string')) {
    f = { ...f, type: 'text', rows: Math.max(f.rows ?? 0, 5) }
  } else if (f.name === 'subhead' && (f.type === 'text' || f.type === 'string')) {
    // A short line between the headline and the body (Feature Split — Dark).
    f = { ...f, title: f.title ?? 'Subhead', type: 'text', rows: Math.max(f.rows ?? 0, 2) }
  }
  if (!f.description) {
    const description = f.title === 'Card style' ? 'The colour of each card. On Dark the card text turns white.' : DESCRIPTIONS[f.name]
    if (description) f = { ...f, description }
  }
  const group = f.name === 'hidden' ? ['content', 'design'] : isDesignField(f) ? 'design' : 'content'
  return { ...f, group }
}

export function applyBlockConventions<T extends Def>(type: T): T {
  if (!type.fields) return type
  const indexed = type.fields.map((field: Def, i: number) => ({ field: tidyField(field), i }))
  const sortKey = ({ field, i }: { field: Def; i: number }) =>
    field.name === 'hidden'
      ? [0, 0, i]
      : field.group === 'design'
        ? [2, rank(DESIGN_ORDER, field.name), i]
        : [1, rank(CONTENT_ORDER, field.name), i]
  const sorted = [...indexed].sort((a, b) => {
    const ka = sortKey(a)
    const kb = sortKey(b)
    return ka[0] - kb[0] || ka[1] - kb[1] || ka[2] - kb[2]
  })
  return { ...type, groups: BLOCK_GROUPS, fields: sorted.map(({ field }) => field) }
}
