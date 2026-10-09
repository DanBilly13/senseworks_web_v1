import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const teamGridBlock = defineType({
  name: 'teamGridBlock',
  title: 'Team Grid',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'members',
      title: 'People',
      description: 'Leave empty to show every Team member, A–Z. Pick people to show just them, in this order.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })],
    }),
    spacingField,
  ],
  preview: {
    select: { count: 'members.length' },
    prepare: ({ count }) => ({
      title: 'Team Grid',
      subtitle: count ? `${count} people` : 'Everyone',
    }),
  },
})
