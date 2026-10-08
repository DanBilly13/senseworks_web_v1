import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headingLayoutField } from '../fields/headingLayoutField'
import { titleSizeField } from '../fields/titleSizeField'
import { spacingField } from '../fields/spacingField'

// Deliberately no top-level eyebrow/heading/body — same reasoning as
// Card Grid: pair this with a separate intro block (e.g. Section
// Headline) above it when one's needed, rather than baking one in.
export const featureGridBlock = defineType({
  name: 'featureGridBlock',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      description: 'Tablet stays 2-column regardless — this only controls the desktop breakpoint.',
      type: 'string',
      options: {
        list: [
          { title: '2', value: '2' },
          { title: '3', value: '3' },
          { title: '4', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '3',
    }),
    defineField({
      name: 'iconSize',
      title: 'Icon size',
      description: 'Large: 64px desktop / 56px mobile. Small: 32px desktop / 24px mobile.',
      type: 'string',
      options: {
        list: [
          { title: 'Large (default)', value: 'large' },
          { title: 'Small', value: 'small' },
        ],
        layout: 'radio',
      },
      initialValue: 'large',
    }),
    headingLayoutField,
    titleSizeField(),
    spacingField,
    defineField({
      name: 'items',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'iconImage',
              title: 'Icon (upload)',
              description:
                'Optional — upload an SVG (or a PNG with a transparent background). Any black in the file follows the site\'s text colour; other colours (an accent, say) are kept as they are. A PNG is drawn in a single colour. Material Symbols (fonts.google.com/icons) downloads as SVG. Leave empty to use the checkmark, or pick one from the list below.',
              type: 'image',
              options: { accept: 'image/svg+xml,image/png' },
            }),
            defineField({
              name: 'icon',
              title: 'Icon (from the list)',
              description:
                'Optional — a short list of ready-made icons. Ignored if an icon is uploaded above. Leave both empty to keep the default checkmark.',
              type: 'string',
              options: {
                list: [
                  { title: 'Home / work', value: 'home_work' },
                  { title: 'Event busy', value: 'event_busy' },
                  { title: 'Lock', value: 'lock' },
                  { title: 'Work', value: 'work' },
                  { title: 'Bolt / boost', value: 'bolt_boost' },
                  { title: 'Support agent', value: 'support_agent' },
                  { title: 'Toggle off', value: 'toggle_off' },
                ],
              },
            }),
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(600),
            }),
            defineField({ name: 'ctaLabel', title: 'Link label', type: 'string' }),
            defineField({ name: 'ctaHref', title: 'Link href', type: 'string' }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Feature Grid',
      subtitle: `${items?.length ?? 0} items`,
    }),
  },
})
