import { defineType } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// Every blog post (from "Blog post" in Studio): the All / News / Insights chips, then the posts under their years, newest first. For the Blog page; the posts themselves are edited as Blog posts.
// Nothing to fill in: the list comes from the documents themselves.
export const blogPostsBlock = defineType({
  name: 'blogPostsBlock',
  title: 'Blog Posts',
  type: 'object',
  fields: [hiddenField, spacingField],
  preview: { prepare: () => ({ title: 'Blog Posts', subtitle: 'Filled in automatically' }) },
})
