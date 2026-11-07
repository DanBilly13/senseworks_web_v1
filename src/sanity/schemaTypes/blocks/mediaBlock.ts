import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'

// Background and its Top/Bottom padding: Content width only (at Full
// screen width the media is the whole block, nothing shows round it).
const hiddenAtFullWidth = ({ parent }: { parent?: { width?: string } }) => parent?.width === 'full'

export const mediaBlock = defineType({
  name: 'mediaBlock',
  title: 'Media',
  type: 'object',
  fields: [
    hiddenField,
    // Optional, matching every other block's `media` field (Hero,
    // Feature Split, Bento Grid, Case Study Grid) — the component
    // already renders a placeholder when it's empty, so this was
    // blocking Studio publish for no real reason.
    defineField({ name: 'media', title: 'Media', type: 'media' }),
    defineField({
      name: 'width',
      title: 'Width',
      description:
        'Full screen width runs edge to edge with square corners, at the same height as a CTA Banner with an image (the image is cropped to fill).',
      type: 'string',
      options: {
        list: [
          { title: 'Content width (default)', value: 'content' },
          { title: 'Full screen width', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'content',
    }),
    defineField({
      name: 'ratio',
      title: 'Ratio',
      description: 'The frame’s shape on desktop (the image is cropped to fill). Phones: see the Mobile tab.',
      type: 'string',
      options: {
        list: [
          { title: '7:5 (default)', value: '7:5' },
          { title: '7:4 (wider)', value: '7:4' },
          { title: '3:1 (wide strip)', value: '3:1' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '7:5',
      hidden: ({ parent }) => parent?.width === 'full',
    }),
    // All optional, and all off by default (empty) — an editor using
    // this block for plain media, no text, sees no change. Filling any
    // of these in switches the component into the overlay layout: a
    // scrim over the media with this copy on top, same treatment as
    // Hero's "image overlay" layout.
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'align',
      title: 'Text alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    ...bandFields({ withDarkGradient: true }).map((field) => ({ ...field, hidden: hiddenAtFullWidth })),
    defineField({
      name: 'keyline',
      title: 'Outline',
      description: 'A thin line in our black around the frame, from tablet up. It stays 1px while the media grows on scroll.',
      type: 'boolean',
      initialValue: false,
      hidden: hiddenAtFullWidth,
    }),
    defineField({
      name: 'growOnScroll',
      title: 'Grow on scroll',
      description:
        'The media starts at half size as it comes up into the screen and grows to full size by the time it’s in the middle of the screen, quickly at first, then slowing. Visitors who ask for less motion see it at full size.',
      type: 'boolean',
      initialValue: false,
      hidden: hiddenAtFullWidth,
    }),
    // Like the heroes' (BlockRenderer pins it).
    defineField({
      name: 'pinned',
      title: 'Content scrolls over it',
      description:
        'From tablet up, the media stays put once it reaches the top of the screen (or, taller than the screen, once its bottom is on screen) and the rest of the page scrolls up over it. Section spacing becomes the space at the top of what scrolls over.',
      type: 'boolean',
      initialValue: false,
    }),
    spacingField,
    // The Mobile tab: phone versions of the look settings, each starting
    // as "Same as desktop" (Width keeps its own phone default).
    defineField({
      name: 'mobileMedia',
      title: 'Phone media',
      description: 'Optional: a different image or video just for phones, e.g. a portrait crop. Empty shows the desktop media.',
      type: 'media',
      group: 'mobile',
    }),
    defineField({
      name: 'mobileFit',
      title: 'Width',
      description:
        'Inside margins: rounded, the shape below, nothing cropped (good for screen recordings). Edge to edge: the full screen width, square corners, the shape below. Edge to edge, tall: full width and most of the screen’s height, cropped to fill (good for photos). Media with text on it is always edge to edge, tall. "Content scrolls over it" never pins on phones.',
      type: 'string',
      options: {
        list: [
          { title: 'Edge to edge, tall', value: 'fill' },
          { title: 'Edge to edge', value: 'edge' },
          { title: 'Inside margins', value: 'frame' },
        ],
        layout: 'radio',
      },
      initialValue: 'fill',
      group: 'mobile',
      hidden: ({ parent }) => parent?.width === 'full',
    }),
    defineField({
      name: 'mobileRatio',
      title: 'Ratio',
      description: 'The frame’s shape on phones (Edge to edge or Inside margins). Square and portrait (4:5) suit phones well.',
      type: 'string',
      options: {
        list: [
          { title: 'Same as desktop', value: 'inherit' },
          { title: '7:5', value: '7:5' },
          { title: '7:4', value: '7:4' },
          { title: '3:1', value: '3:1' },
          { title: '1:1', value: '1:1' },
          { title: '4:5', value: '4:5' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'inherit',
      group: 'mobile',
      hidden: ({ parent }) => parent?.width === 'full' || (parent?.mobileFit ?? 'fill') === 'fill',
    }),
    defineField({
      name: 'mobileGrow',
      title: 'Grow on scroll',
      description: 'On phones: grow from half size as it scrolls in, or not.',
      type: 'string',
      options: { list: [{ title: 'Same as desktop', value: 'inherit' }, { title: 'On', value: 'on' }, { title: 'Off', value: 'off' }], layout: 'radio', direction: 'horizontal' },
      initialValue: 'inherit',
      group: 'mobile',
      hidden: ({ parent }) => parent?.width === 'full',
    }),
    defineField({
      name: 'mobileKeyline',
      title: 'Outline',
      description: 'On phones: the thin black line around the frame (shows when Width is Inside margins).',
      type: 'string',
      options: { list: [{ title: 'Same as desktop', value: 'inherit' }, { title: 'On', value: 'on' }, { title: 'Off', value: 'off' }], layout: 'radio', direction: 'horizontal' },
      initialValue: 'inherit',
      group: 'mobile',
      hidden: ({ parent }) => parent?.width === 'full',
    }),
    defineField({
      name: 'mobileAlign',
      title: 'Text alignment',
      description: 'On phones, for media with text on it.',
      type: 'string',
      options: { list: [{ title: 'Same as desktop', value: 'inherit' }, { title: 'Left', value: 'left' }, { title: 'Center', value: 'center' }], layout: 'radio', direction: 'horizontal' },
      initialValue: 'inherit',
      group: 'mobile',
    }),
    defineField({
      name: 'mobileBackground',
      title: 'Background',
      description: 'The colour behind the media on phones, whatever desktop has. None drops the background (and its padding) on phones.',
      type: 'string',
      options: {
        list: [
          { title: 'Same as desktop', value: 'inherit' },
          { title: 'None', value: 'none' },
          { title: 'Dark', value: 'dark' },
          { title: 'Accent', value: 'accent' },
          { title: 'Accent gradient', value: 'accentGradient' },
          { title: 'Dark accent gradient', value: 'accentDark' },
        ],
        layout: 'radio',
      },
      initialValue: 'inherit',
      group: 'mobile',
      hidden: ({ parent }) => parent?.width === 'full',
    }),
    defineField({
      name: 'mobilePaddingTop',
      title: 'Top padding',
      description: 'On phones: the space above the media (inside the background, when there is one). Same as desktop: as desktop shows it (none without a background).',
      type: 'string',
      options: {
        list: [{ title: 'Same as desktop', value: 'inherit' }, { title: 'Loose', value: 'loose' }, { title: 'Medium', value: 'medium' }, { title: 'Tight', value: 'tight' }, { title: 'None', value: 'none' }],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'inherit',
      group: 'mobile',
      hidden: ({ parent }) => parent?.width === 'full',
    }),
    defineField({
      name: 'mobilePaddingBottom',
      title: 'Bottom padding',
      description: 'On phones: the space below the media (inside the background, when there is one), before the Section spacing gap. Same as desktop: as desktop shows it (none without a background).',
      type: 'string',
      options: {
        list: [{ title: 'Same as desktop', value: 'inherit' }, { title: 'Loose', value: 'loose' }, { title: 'Medium', value: 'medium' }, { title: 'Tight', value: 'tight' }, { title: 'None', value: 'none' }],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'inherit',
      group: 'mobile',
      hidden: ({ parent }) => parent?.width === 'full',
    }),
    defineField({
      name: 'mobileSpacing',
      title: 'Section spacing',
      description: 'On phones: the gap after this block.',
      type: 'string',
      options: {
        list: [{ title: 'Same as desktop', value: 'inherit' }, { title: 'Loose', value: 'loose' }, { title: 'Medium', value: 'medium' }, { title: 'Tight', value: 'tight' }, { title: 'None', value: 'none' }],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'inherit',
      group: 'mobile',
    }),
  ],
  preview: {
    select: { alt: 'media.alt', mediaType: 'media.mediaType', headline: 'headline' },
    prepare: ({ alt, mediaType, headline }) => ({
      title: `Media — ${headline || alt || 'Untitled'}`,
      subtitle: mediaType ? mediaType.charAt(0).toUpperCase() + mediaType.slice(1) : undefined,
    }),
  },
})
