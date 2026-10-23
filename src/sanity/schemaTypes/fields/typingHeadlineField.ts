import { defineField } from 'sanity'

// A hero's "Typing effect" (components/ui/TypingText): the headline types
// itself out once on load, with a cursor that blinks and fades. Off by
// default.
export const typingHeadlineField = () =>
  defineField({
    name: 'typingHeadline',
    title: 'Typing effect',
    description:
      'The headline types itself out once when the page loads, with a cursor that blinks and fades. Visitors with reduced motion see it finished.',
    type: 'boolean',
    initialValue: false,
  })
