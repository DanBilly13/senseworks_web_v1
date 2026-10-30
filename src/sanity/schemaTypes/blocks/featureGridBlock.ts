import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headingLayoutField } from '../fields/headingLayoutField'
import { titleSizeField } from '../fields/titleSizeField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'
import { IconPresetInput, type IconPreset } from '../../components/IconPresetInput'

// Feature Grid's ready-made icons (keep in step with ICON_SRC in
// components/blocks/FeatureGridBlock.tsx).
const ICON_PRESETS: IconPreset[] = [
  { title: 'Home / work', value: 'home_work' },
  { title: 'Event busy', value: 'event_busy' },
  { title: 'Lock', value: 'lock' },
  { title: 'Work', value: 'work' },
  { title: 'Bolt / boost', value: 'bolt_boost' },
  { title: 'Support agent', value: 'support_agent' },
  { title: 'Toggle off', value: 'toggle_off' },
]

// Deliberately no top-level eyebrow/heading/body — same reasoning as
// Card Grid: pair this with a separate intro block (e.g. Section
// Headline) above it when one's needed, rather than baking one in.
// A feature's icon fields are hidden while its Feature Grid has "Show
// icons" off. The item's own block isn't handed to `hidden`, so it's
// found in the document by the item's key.
const iconsOff = ({ document, parent }: { document?: Record<string, unknown>; parent?: { _key?: string } }) => {
  const blocks = (document?.blocks ?? []) as { showIcons?: boolean; items?: { _key?: string }[] }[]
  const block = blocks.find((b) => b.items?.some((item) => item._key === parent?._key))
  return block?.showIcons === false
}

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
      name: 'showIcons',
      title: 'Show icons',
      description:
        'On: each feature shows its icon (the checkmark unless you choose another below). Off: no icons at all.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'iconSize',
      title: 'Icon size',
      hidden: ({ parent }) => parent?.showIcons === false,
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
    defineField({
      name: 'linkStyle',
      title: 'Link style',
      description: 'For items with a link. Inline puts it at the end of the description, as a text link in the paragraph.',
      type: 'string',
      options: {
        list: [
          { title: 'Below the text (default)', value: 'below' },
          { title: 'Inline, at the end of the text', value: 'inline' },
        ],
        layout: 'radio',
      },
      initialValue: 'below',
    }),
    titleSizeField(),
    ...bandFields({ withDarkGradient: true }),
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
              hidden: iconsOff,
            }),
            defineField({
              name: 'icon',
              title: 'Icon (from the list)',
              hidden: iconsOff,
              description:
                'Optional — a short list of ready-made icons. Ignored if an icon is uploaded above. Leave both empty to keep the default checkmark.',
              type: 'string',
              components: { input: IconPresetInput },
              // Not Sanity's `list` (a hard error for any value not on it):
              // see IconPresetInput. Anything else just warns, and the site
              // ignores it.
              options: { localize: false, presets: ICON_PRESETS } as never,
              validation: (Rule) =>
                Rule.custom((value?: string) =>
                  !value || ICON_PRESETS.some((p) => p.value === value)
                    ? true
                    : `"${value}" isn't one of the listed icons, so it's ignored — choose one or None`,
                ).warning(),
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
