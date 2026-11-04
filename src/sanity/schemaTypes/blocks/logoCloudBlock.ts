import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'

// The standard Top/Bottom padding (inside the background).
const [, paddingTopField, paddingBottomField] = bandFields()

export const logoCloudBlock = defineType({
  name: 'logoCloudBlock',
  title: 'Logo Cloud',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'client' }] })],
    }),
    // The background runs the full screen width; the logos stay in the
    // page column. Light grey stays the default it has always had.
    defineField({
      name: 'tone',
      title: 'Background',
      description:
        'Fills the full screen width behind the logos, which stay at content width. None sits straight on the page.',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Light grey', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Accent', value: 'accent' },
          { title: 'Accent gradient', value: 'accentGradient' },
          { title: 'Dark accent gradient', value: 'accentDark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    paddingTopField,
    paddingBottomField,
    spacingField,
  ],
  preview: {
    select: { logos: 'logos' },
    prepare: ({ logos }) => ({
      title: 'Logo Cloud',
      subtitle: `${logos?.length ?? 0} logos`,
    }),
  },
})
