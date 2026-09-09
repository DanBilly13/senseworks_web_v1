import { defineType, defineArrayMember, defineField } from 'sanity'

// Deliberately minimal for v1 — normal prose (headings, lists, links,
// bold/italic) plus inline images. A guide author works entirely
// within this one field (no page-builder-style block assembly); a
// curated set of richer embeds (callout, code, numbered step) is a
// likely v2 addition once real content shows which of those are
// actually needed, rather than guessing them in now.
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [defineField({ name: 'href', type: 'url', validation: (Rule) => Rule.required() })],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
  ],
})
