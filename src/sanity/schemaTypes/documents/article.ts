import { defineType, defineField, defineArrayMember } from 'sanity'
import { isUniqueInLanguage } from '../../lib/isUniqueInLanguage'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      // Unique per language: the en and sv versions share a slug.
      options: { source: 'title', isUnique: isUniqueInLanguage },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'subtitle', type: 'string' }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tag' }] })],
    }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'teamMember' }] }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    // Set by @sanity/document-internationalization — not hand-edited.
    defineField({ name: 'language', type: 'string', readOnly: true }),
    defineField({ name: 'body', type: 'blockContent' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'coverImage' },
  },
})
