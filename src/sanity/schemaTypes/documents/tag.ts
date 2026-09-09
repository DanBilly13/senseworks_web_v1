import { defineType, defineField } from 'sanity'

// A real document type (not a free-text array on article) so the set
// of tags stays a fixed, reusable list as content grows — an author
// picks from existing tags instead of retyping near-duplicates
// ("Revision" vs "revision" vs "Revisionen").
export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
