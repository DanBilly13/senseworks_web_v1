import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headingLayoutField } from '../fields/headingLayoutField'
import { titleSizeField } from '../fields/titleSizeField'
import { spacingField } from '../fields/spacingField'

// Same reasoning as Feature Grid/Bento Grid: no intro of its own —
// pair with a separate Section Headline block above it when one's
// needed, rather than baking one in.
export const stepsBlock = defineType({
  name: 'stepsBlock',
  title: 'Steps',
  type: 'object',
  fields: [
    hiddenField,
    headingLayoutField,
    titleSizeField(),
    spacingField,
    defineField({
      name: 'items',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            // No number field — steps are numbered automatically from
            // their position in this list (01, 02, ...), so reordering
            // items here always keeps the numbers in sync instead of
            // risking a typo'd or out-of-sequence manual number.
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'body',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(200),
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Steps',
      subtitle: `${items?.length ?? 0} steps`,
    }),
  },
})
