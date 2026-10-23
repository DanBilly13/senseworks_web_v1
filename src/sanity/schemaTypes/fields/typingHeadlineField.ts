import { defineField } from 'sanity'

// A hero's "Typing effect" (components/ui/TypingText): the headline types
// itself out once on load, then a cursor blinks after the last letter.
// Off by default.
export const typingHeadlineField = () =>
  defineField({
    name: 'typingHeadline',
    title: 'Typing effect',
    description:
      'The headline types itself out once when the page loads, then a cursor keeps blinking after the last letter. Visitors with reduced motion see it finished.',
    type: 'boolean',
    initialValue: false,
  })
