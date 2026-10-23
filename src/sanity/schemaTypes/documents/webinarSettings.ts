import { defineType, defineField, defineArrayMember } from 'sanity'
import { localized } from './bookMeetingSettings'

// The "Book a webinar" modal (BookWebinarModal), opened by any button
// linking to "#book-webinar". English and Swedish side by side, like Book
// a meeting; a language left empty falls back to English, then to the
// copy hardcoded in the modal. A singleton — see the structure and the
// filters in sanity.config.ts.
export const webinarSettings = defineType({
  name: 'webinarSettings',
  title: 'Book a webinar',
  type: 'document',
  fields: [
    localized('dateLabel', 'Date line', {
      description: 'The small chip above the heading, e.g. "Livewebinar · 12 november kl. 10:00 · 45 min".',
    }),
    localized('heading', 'Heading'),
    localized('intro', 'Intro', { multiline: true }),
    defineField({
      name: 'points',
      title: 'Points',
      description: 'The ticked list under the intro.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'string' }),
            defineField({ name: 'sv', title: 'Swedish', type: 'string' }),
          ],
          preview: { select: { title: 'sv', subtitle: 'en' } },
        }),
      ],
    }),
    localized('meetingLinkLabel', 'Walkthrough link', {
      description: 'The link under the points that opens the Book a meeting modal instead, e.g. "Hellre en egen genomgång? Boka 30 minuter".',
    }),
    localized('seatsLabel', 'Seats label', { description: 'Next to the dot above the seats bar, e.g. "Platserna går fort".' }),
    defineField({
      name: 'seatsTotal',
      title: 'Seats in total',
      type: 'number',
      initialValue: 100,
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: 'seatsLeft',
      title: 'Seats left',
      description: 'Shown as "23 av 100 kvar", with the bar filled by the seats taken. Update it by hand.',
      type: 'number',
      initialValue: 100,
      validation: (Rule) => Rule.min(0).integer(),
    }),
    localized('submitLabel', 'Button label'),
    localized('finePrint', 'Text under the button', { multiline: true }),
    localized('thanksHeading', 'Thank-you heading', { description: 'Shown in place of the form after signing up.' }),
    localized('thanksBody', 'Thank-you text', { multiline: true }),
  ],
  preview: {
    prepare: () => ({ title: 'Book a webinar' }),
  },
})
