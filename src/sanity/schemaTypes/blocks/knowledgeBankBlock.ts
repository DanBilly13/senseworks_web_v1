import { defineType } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// Every Knowledge Bank article with a title in the page's language (from "Article" in Studio), with tag filters and Newest / Oldest sorting. For the Knowledge Bank page.
// Nothing to fill in: the list comes from the documents themselves.
export const knowledgeBankBlock = defineType({
  name: 'knowledgeBankBlock',
  title: 'Knowledge Bank Articles',
  type: 'object',
  fields: [hiddenField, spacingField],
  preview: { prepare: () => ({ title: 'Knowledge Bank Articles', subtitle: 'Filled in automatically' }) },
})
