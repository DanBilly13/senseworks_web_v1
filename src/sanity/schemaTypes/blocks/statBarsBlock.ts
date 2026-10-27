import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'

// Stats stacked as rows that show their size — an alternative to Stats
// Band's three columns. Bars: each stat a track filled to its share.
// Dots: ten dots, its share of them filled. No intro of its own — pair
// it with a Section Headline above.
export const statBarsBlock = defineType({
  name: 'statBarsBlock',
  title: 'Stat Bars',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Bars (default)', value: 'bars' },
          { title: 'Dots (ten, the share filled)', value: 'dots' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'bars',
    }),
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Number',
              description: 'As shown, e.g. "4 av 5", "86%" or "20 %".',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'label', type: 'text', rows: 2 }),
            defineField({
              name: 'share',
              title: 'Share (%)',
              description:
                'How full the bar is, or how many of the ten dots are filled. Left empty, it’s worked out from the number: "4 av 5" → 80, "20 %" → 20.',
              type: 'number',
              validation: (Rule) => Rule.min(0).max(100),
            }),
          ],
          preview: {
            select: { value: 'value', label: 'label' },
            prepare: ({ value, label }) => {
              const pick = (v: unknown) => (typeof v === 'object' && v ? (v as { en?: string; sv?: string }).en || (v as { sv?: string }).sv : (v as string | undefined))
              return { title: pick(value) || 'Stat', subtitle: pick(label) }
            },
          },
        }),
      ],
    }),
    defineField({ name: 'source', title: 'Source', description: 'Optional small line under the stats, e.g. "Källa: …".', type: 'string' }),
    ...bandFields({ withDarkGradient: true }),
    spacingField,
  ],
  preview: {
    select: { items: 'items', style: 'style' },
    prepare: ({ items, style }) => ({
      title: 'Stat Bars',
      subtitle: `${items?.length ?? 0} stats, ${style === 'dots' ? 'dots' : 'bars'}`,
    }),
  },
})
