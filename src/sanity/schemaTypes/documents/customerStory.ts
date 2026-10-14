import { defineType, defineField, defineArrayMember } from 'sanity'
import { blockContentMembers } from '../objects/blockContent'
import { isUniqueInLanguage } from '../../lib/isUniqueInLanguage'

// A customer story: the firm's case study card (shown on the Customer
// stories start page) plus the full story behind it, laid out like a
// Knowledge Bank article.
export const customerStory = defineType({
  name: 'customerStory',
  title: 'Customer story',
  type: 'document',
  // A new story's Interviewer is whoever is creating it: the Team
  // member whose email matches the logged-in Studio user. Editable.
  initialValue: async (_params, { currentUser, getClient }) => {
    const email = currentUser?.email
    if (!email) return {}
    const id = await getClient({ apiVersion: '2024-01-01' }).fetch<string | null>(
      `*[_type == "teamMember" && lower(email) == lower($email)][0]._id`,
      { email },
    )
    return id ? { author: { _type: 'reference', _ref: id } } : {}
  },
  groups: [
    { name: 'card', title: 'Card', default: true },
    { name: 'story', title: 'Story' },
  ],
  fields: [
    // Card
    defineField({
      name: 'companyName',
      title: 'Company name',
      type: 'string',
      group: 'card',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'card',
      // Unique per language: the en and sv versions share a slug.
      options: { source: 'companyName', isUnique: isUniqueInLanguage },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'media', group: 'card', description: 'Shown instead of the company name when set.' }),
    defineField({ name: 'facts', type: 'string', group: 'card', description: 'e.g. "25 staff, six offices".' }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      group: 'card',
      of: [{ type: 'string' }],
      description:
        'Tick what they use. Decides where the story shows: a carousel set to Audit shows stories ticked Audit (including both), likewise Analytics. Also the start page filters.',
      options: {
        list: [
          { title: 'Audit', value: 'audit' },
          { title: 'Analytics', value: 'analytics' },
        ],
        layout: 'grid',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 2,
      group: 'card',
      description: 'The outcome, in one line, e.g. "Replaced manual Excel analytics with real-time, multi-user audit collaboration." Shown on the card (not on the story page) and as the description in search results.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'quote',
      title: 'Hero quote',
      type: 'text',
      rows: 3,
      group: 'card',
      description: 'The big pull quote in the story (place it with a "Pull quote" item in the Body).',
      validation: (Rule) => Rule.max(220),
    }),
    defineField({ name: 'personName', title: 'Person name', type: 'string', group: 'card' }),
    defineField({ name: 'personRole', title: 'Person role', type: 'string', group: 'card' }),
    // Story
    defineField({
      name: 'title',
      type: 'string',
      group: 'story',
      description: "The story's headline. Leave empty to use the company name.",
    }),
    defineField({
      name: 'subtitle',
      title: 'Standfirst',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'The short summary under the headline, in larger type.',
    }),
    defineField({ name: 'location', type: 'string', group: 'story', description: 'For the "At a glance" box, e.g. "Northern Stockholm".' }),
    defineField({
      name: 'companySize',
      title: 'Size',
      type: 'string',
      group: 'story',
      description: 'Number of employees, for the "At a glance" box. Shown as e.g. "1–10 employees" ("1–10 anställda" on Swedish pages).',
      options: {
        list: [
          { title: '1–10 employees', value: '1-10' },
          { title: '11–25 employees', value: '11-25' },
          { title: '26–50 employees', value: '26-50' },
          { title: '51–100 employees', value: '51-100' },
          { title: '100+ employees', value: '100+' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'customerSince', title: 'Customer since', type: 'string', group: 'story', description: 'For the "At a glance" box, e.g. "Autumn 2024".' }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', group: 'story', options: { hotspot: true } }),
    defineField({
      name: 'author',
      title: 'Interviewer',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      group: 'story',
      description: 'Filled in with you when you create a story (matched by your email on your Team member). Shown in the byline as "Interviewed by".',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'story',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    // Set by @sanity/document-internationalization — not hand-edited.
    defineField({ name: 'language', type: 'string', readOnly: true }),
    defineField({
      name: 'body',
      type: 'array',
      group: 'story',
      description: 'Add a "Pull quote" item where the Hero quote should appear, ideally about halfway down.',
      of: [
        // The shared body item types, with one extra paragraph style for
        // interviews: "Question", set semi-bold.
        ...blockContentMembers.map((member) =>
          member.type === 'block'
            ? { ...member, styles: [...(member.styles ?? []), { title: 'Question', value: 'question' }] }
            : member,
        ),
        defineArrayMember({
          name: 'pullQuote',
          title: 'Pull quote',
          type: 'object',
          // Sanity needs a field on an object type; the quote itself is
          // the story's Hero quote, so there's nothing to fill in here.
          fields: [
            defineField({
              name: 'note',
              type: 'string',
              readOnly: true,
              description: "Shows this story's Hero quote here, set large.",
            }),
          ],
          preview: { prepare: () => ({ title: 'Pull quote', subtitle: "The story's Hero quote, set large" }) },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'companyName', subtitle: 'summary', media: 'coverImage' },
  },
})
