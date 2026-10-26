import { defineType, defineField, defineArrayMember } from 'sanity'

// One thing we're shipping: shown on the Releases page (Releases
// Timeline block: Rolling out, Shipped by month, In development) and,
// once shipped, among the latest on Home (Release Cards block). Text
// fields are English/Swedish pairs (localizeSchema.ts).
export const release = defineType({
  name: 'release',
  title: 'Release',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'tag',
      title: 'Category chip',
      description: 'Audit is purple, Analytics green, Support yellow. Also what the Releases page filters by.',
      type: 'string',
      options: {
        list: [
          { title: 'Audit (purple)', value: 'audit' },
          { title: 'Analytics (green)', value: 'analysis' },
          { title: 'Support (yellow)', value: 'customerService' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'ai',
      title: 'AI',
      description: 'Adds a dark "AI" chip next to the category chip, and puts it under the AI filter on the Releases page.',
      type: 'boolean',
      initialValue: false,
    }),
    // A stage rather than a percentage: "Rolling out 70%" read as a
    // precise measure and a hidden date ("so, December?").
    defineField({
      name: 'stage',
      description:
        'Where it is. Decides its section on the Releases page, and which Release Cards blocks show it (each chooses its stages).',
      type: 'string',
      options: {
        list: [
          { title: 'In development', value: 'development' },
          { title: 'Rolling out', value: 'rollingOut' },
          { title: 'Shipped', value: 'shipped' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'shipped',
      validation: (Rule) => Rule.required(),
    }),
    // Only a shipped release has a date — what's rolling out or in
    // development deliberately shows none, so nothing reads as a promise.
    defineField({
      name: 'date',
      title: 'Shipped on',
      description: 'Groups it under its month on the Releases page, and orders Home newest first.',
      type: 'date',
      options: { dateFormat: 'D MMM YYYY' },
      hidden: ({ document }) => document?.stage !== 'shipped',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          (context.document as { stage?: string } | undefined)?.stage === 'shipped' && !value
            ? 'Add the date it shipped'
            : true,
        ),
    }),
    defineField({
      name: 'media',
      title: 'Image',
      description: 'Optional — a screenshot of what was released.',
      type: 'media',
    }),
    defineField({
      name: 'team',
      title: 'Team',
      description: 'Up to 6 people who worked on it, shown as small overlapping round photos.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })],
      validation: (Rule) => Rule.max(6).unique(),
    }),
  ],
  orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', stage: 'stage', date: 'date', media: 'media.image' },
    prepare: ({ title, stage, date, media }) => ({
      title,
      subtitle: stage === 'shipped' ? `Shipped ${date ?? ''}`.trim() : stage === 'rollingOut' ? 'Rolling out' : 'In development',
      media,
    }),
  },
})
