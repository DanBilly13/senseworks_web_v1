import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { headlineSizeField } from '../fields/headlineSizeField'
import { typingHeadlineField } from '../fields/typingHeadlineField'
import { phoneAlignField, phoneHeadlineSizeField, phoneMediaField, phoneSpacingField } from '../fields/mobileFields'

// Experimental Hero variant: a flexible full-bleed backdrop (image,
// solid color, or the shared accent gradient) behind text plus a
// separate "showcase" image/video sitting on top of it. Kept as its
// own block (not a heroBlock layout option) so it can be iterated on
// or dropped without touching the stable Hero block.
export const heroBackdropBlock = defineType({
  name: 'heroBackdropBlock',
  title: 'Hero — Backdrop',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'backgroundType',
      title: 'Background type',
      description: 'What fills the hero behind the text. None leaves the page background showing; an image with no picture chosen shows nothing either. Color and Gradient are picked below.',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Image', value: 'image' },
          { title: 'Color', value: 'color' },
          { title: 'Gradient', value: 'gradient' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      description: 'Fills the whole hero behind the text, under a dark tint. Remove the picture and the hero shows the page background.',
      type: 'media',
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background color',
      description: 'The colour behind the whole hero. Pick a matching Text color below.',
      type: 'string',
      options: {
        list: [
          { title: 'Dark', value: 'dark' },
          { title: 'Accent', value: 'accent' },
          { title: 'Light grey', value: 'light' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
      hidden: ({ parent }) => parent?.backgroundType !== 'color',
    }),
    defineField({
      name: 'textTone',
      title: 'Text color',
      description: 'Light text for a dark image or colour, dark text for a light one.',
      type: 'string',
      options: {
        list: [
          { title: 'Light text', value: 'light' },
          { title: 'Dark text', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      // Text, not string, so Enter adds a line break (see SectionIntro).
      type: 'text',
      rows: 2,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required().max(80),
    }),
    headlineSizeField(),
    typingHeadlineField(),
    defineField({
      name: 'body',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(350),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({ name: 'secondaryCtaLabel', title: 'Secondary link label', type: 'string' }),
    defineField({ name: 'secondaryCtaHref', title: 'Secondary link href', type: 'string' }),
    defineField({
      name: 'ctaNote',
      title: 'Button note',
      description: 'Small line of microcopy under the button, e.g. what happens after clicking it.',
      type: 'string',
    }),
    defineField({
      name: 'showcaseMedia',
      title: 'Showcase Media',
      description:
        'Sits on top of the backdrop, below the text — starts at 50% of the viewport height while we dial this in.',
      type: 'media',
    }),
    // Default Medium (not the shared field's Loose): that's the old
    // fixed gap this hero already had, so existing ones don't shift.
    {
      ...spacingField,
      initialValue: 'medium',
      description:
        'The gap below this hero, before the next block. Medium is the hero\u2019s original fixed gap.',
    },
    // The Mobile tab.
    phoneHeadlineSizeField(),
    phoneAlignField(),
    {
      ...phoneMediaField('mobileBackgroundImage', 'Phone background image', 'Optional: a different background image just for phones, e.g. a portrait crop. Empty shows the desktop one.'),
      hidden: ({ parent }: { parent?: { backgroundType?: string } }) => (parent?.backgroundType ?? 'image') !== 'image',
    },
    phoneMediaField('mobileShowcaseMedia', 'Phone showcase media', 'Optional: a different showcase image or video just for phones. Empty shows the desktop one.'),
    phoneSpacingField(),
  ],
  preview: {
    select: { title: 'headline', backgroundType: 'backgroundType' },
    prepare: ({ title, backgroundType }) => ({
      title: `Hero — Backdrop — ${title || 'Untitled'}`,
      subtitle: `Background: ${backgroundType || 'image'}`,
    }),
  },
})
