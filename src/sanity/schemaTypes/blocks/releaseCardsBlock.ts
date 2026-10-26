import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const releaseCardsBlock = defineType({
  name: 'releaseCardsBlock',
  title: 'Release Cards',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'columns',
      type: 'string',
      options: {
        list: [
          { title: '2 (default)', value: '2' },
          { title: '3', value: '3' },
          { title: '4', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '2',
    }),
    spacingField,
    // Release documents (edited under "Release" in Studio), not cards
    // typed here — so when a release's stage changes, every block showing
    // it updates by itself.
    defineField({
      name: 'source',
      title: 'Which releases',
      type: 'string',
      options: {
        list: [
          { title: 'The newest, by stage (default)', value: 'latest' },
          { title: 'Choose specific releases', value: 'pick' },
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
    }),
    defineField({
      name: 'stages',
      title: 'Stages',
      description:
        'Which releases to include. Shown with Rolling out first, then Shipped (newest first), then In development. E.g. Shipped + Rolling out for "What Ally does", In development for "Coming next".',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Shipped', value: 'shipped' },
          { title: 'Rolling out', value: 'rollingOut' },
          { title: 'In development', value: 'development' },
        ],
        layout: 'grid',
      },
      initialValue: ['shipped'],
      hidden: ({ parent }) => parent?.source === 'pick',
    }),
    defineField({
      name: 'count',
      title: 'How many',
      type: 'number',
      options: { list: [2, 3, 4, 6, 8], layout: 'radio', direction: 'horizontal' },
      initialValue: 4,
      hidden: ({ parent }) => parent?.source === 'pick',
    }),
    defineField({
      name: 'picked',
      title: 'Releases',
      description: 'Shown in this order, whatever their stage.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'release' }] })],
      hidden: ({ parent }) => parent?.source !== 'pick',
    }),
  ],
  preview: {
    select: { count: 'count', source: 'source', stages: 'stages', picked: 'picked' },
    prepare: ({ count, source, stages, picked }) => {
      const names: Record<string, string> = { shipped: 'shipped', rollingOut: 'rolling out', development: 'in development' }
      const which = ((stages as string[] | undefined)?.length ? (stages as string[]) : ['shipped']).map((s) => names[s] ?? s).join(' + ')
      return {
        title: 'Release Cards',
        subtitle: source === 'pick' ? `${(picked as unknown[] | undefined)?.length ?? 0} chosen releases` : `Latest ${count ?? 4} ${which}`,
      }
    },
  },
})
