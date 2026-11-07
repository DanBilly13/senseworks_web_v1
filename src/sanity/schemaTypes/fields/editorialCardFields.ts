import { defineField } from 'sanity'

// The "Card design" choice and the Editorial card's own settings (see
// components/ui/EditorialCard), shared by Sticky Split cards, Card Grid
// and the Case Study Carousel. Mark, numbers and link style only show
// once Editorial is picked.

const editorial = ({ parent }: { parent?: { cardDesign?: string } }) => parent?.cardDesign !== 'editorial'

export const cardDesignField = defineField({
  name: 'cardDesign',
  title: 'Card design',
  description:
    'Standard: our usual card. Editorial: a thin line across the top, a small label, a big gap, then an all-caps title. Editorial cards can be boxed (a Card style colour) or have no fill (Card style: No fill).',
  type: 'string',
  options: {
    list: [
      { title: 'Standard', value: 'standard' },
      { title: 'Editorial', value: 'editorial' },
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'standard',
})

export const cardMarkField = defineField({
  name: 'cardMark',
  title: 'Mark',
  description: 'Editorial cards: our wave mark at the top right, or nothing.',
  type: 'string',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Wave', value: 'wave' },
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'none',
  hidden: editorial,
})

export const cardNumbersField = defineField({
  name: 'cardNumbers',
  title: 'Number the cards',
  description: 'Editorial cards: 01, 02, 03… in the label. With an eyebrow it reads "01 /ALLY" over two lines.',
  type: 'boolean',
  initialValue: false,
  hidden: editorial,
})

export const linkStyleField = defineField({
  name: 'linkStyle',
  title: 'Link style',
  description: 'Editorial cards: each card’s link as a text link, or as an outline button.',
  type: 'string',
  options: {
    list: [
      { title: 'Text link', value: 'link' },
      { title: 'Button', value: 'button' },
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'link',
  hidden: editorial,
})

// A card's own optional link (Sticky Split and Card Grid cards).
export const cardLinkFields = [
  defineField({ name: 'ctaLabel', title: 'Link text', type: 'string', description: 'Optional, e.g. "Read more".' }),
  defineField({ name: 'ctaHref', title: 'Link', type: 'string', hidden: ({ parent }) => !parent?.ctaLabel }),
]

// "No fill" for the Card style lists: only an Editorial card can go
// without a box; a Standard card picks White instead.
export const NO_FILL_OPTION = { title: 'No fill (Editorial)', value: 'none' }
