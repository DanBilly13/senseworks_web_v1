import { defineType, defineField } from 'sanity'

// Renamed from the earlier "author" type (D-team-roster): the same
// document now backs both article bylines and the Om Oss team roster,
// so "author" stopped being an accurate name the moment it needed to
// include people who don't write articles.
export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 6,
    }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'xUrl', title: 'X (Twitter) URL', type: 'url' }),
    defineField({
      name: 'email',
      type: 'string',
      description:
        'Not shown anywhere by default — Om Oss shows LinkedIn/X instead, so this is safe to fill in without it becoming a public spam target. The one exception: if this person is picked as the contact on "Book a meeting", their email is shown publicly in that modal.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
