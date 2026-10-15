import { defineType, defineField, defineArrayMember } from 'sanity'

// One document per article, both languages in it: title, subtitle and
// body are English/Swedish pairs (localizeSchema.ts). An article can be
// written in just one language — it then only appears on that
// language's Knowledge Bank.
export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', options: { requireOneLanguage: true } as object }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: (doc) => {
          const title = doc.title as { en?: string; sv?: string } | undefined
          return title?.en || title?.sv || ''
        },
      },
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
    // Left over from when each language was its own document; unused.
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'body', type: 'blockContent', options: { localize: true } as object }),
  ],
  preview: {
    select: { titleEn: 'title.en', titleSv: 'title.sv', subtitleEn: 'subtitle.en', subtitleSv: 'subtitle.sv', media: 'coverImage' },
    prepare: ({ titleEn, titleSv, subtitleEn, subtitleSv, media }) => ({
      title: titleEn || titleSv,
      subtitle: subtitleEn || subtitleSv,
      media,
    }),
  },
})
