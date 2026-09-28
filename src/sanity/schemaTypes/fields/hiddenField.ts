import { defineField } from 'sanity'

// Reused at the START of every content block's `fields` array (not
// Header/Footer — D19: those are structural chrome, not optional
// content). Lets an editor toggle a fully-configured block off the
// live site without deleting it — handy mid-edit, or while comparing
// a draft treatment against what's currently live, without losing
// the block's own content in the process.
export const hiddenField = defineField({
  name: 'hidden',
  title: 'Hide block',
  type: 'boolean',
  initialValue: false,
})
