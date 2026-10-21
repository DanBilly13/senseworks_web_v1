import { defineType, defineField } from 'sanity'
import { blockContentMembers } from '../objects/blockContent'

// A blog post (News or Insights) — the archive from 2022 on, at /blog.
// One document per post, both languages in it: title, standfirst and
// body are English/Swedish pairs (localizeSchema.ts). A post can be in
// Swedish only — it then shows only on the Swedish blog.
// Product updates aren't blog posts; they're Releases.
export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', options: { requireOneLanguage: true } as object }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: (doc) => {
          const title = doc.title as { en?: string; sv?: string } | undefined
          return title?.sv || title?.en || ''
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tag',
      description: 'News: funding, partnerships, launches, awards, events, new hires, customers choosing Senseworks. Insights: interviews, opinion, AI and the future of audit, customer learnings.',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Insights', value: 'insights' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'date',
      options: { dateFormat: 'D MMM YYYY' },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'standfirst',
      description: 'One or two sentences under the title, and the excerpt on the blog cards. Left empty, the cards use the opening paragraph.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'generatedCover',
      title: 'Use the generated cover',
      description: 'Shows a plain cover in the tag\'s colour with the Senseworks mark instead of the cover image — for an old, low-quality or awkward photo (a portrait, a logo on white).',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'customerStory',
      title: 'Customer story',
      description: 'When this post has a full customer story, link it: the post then shows a card pointing to it.',
      type: 'reference',
      to: [{ type: 'customerStory' }],
    }),
    defineField({
      name: 'body',
      type: 'array',
      options: { localize: true } as object,
      of: [
        // The shared body items, plus the interview "Question" style from
        // customer stories and a caption under inline images.
        ...blockContentMembers.map((member) =>
          member.type === 'block'
            ? { ...member, styles: [...(member.styles ?? []), { title: 'Question', value: 'question' }] }
            : member.type === 'image'
              ? { ...member, fields: [...(member.fields ?? []), defineField({ name: 'caption', type: 'string' })] }
              : member,
        ),
      ],
    }),
  ],
  orderings: [{ title: 'Newest first', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { titleSv: 'title.sv', titleEn: 'title.en', tag: 'tag', date: 'publishedAt', media: 'coverImage' },
    prepare: ({ titleSv, titleEn, tag, date, media }) => ({
      title: titleSv || titleEn,
      subtitle: [tag === 'news' ? 'News' : tag === 'insights' ? 'Insights' : null, date].filter(Boolean).join(' · '),
      media,
    }),
  },
})
