import { defineType } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// Every customer story (from "Customer story" in Studio) as a grid of cards, with product filters and Newest / Oldest sorting. For the Customer stories page. (Case Study Carousel is the carousel version, for other pages.)
// Nothing to fill in: the list comes from the documents themselves.
export const customerStoriesListBlock = defineType({
  name: 'customerStoriesListBlock',
  title: 'Customer Stories List',
  type: 'object',
  fields: [hiddenField, spacingField],
  preview: { prepare: () => ({ title: 'Customer Stories List', subtitle: 'Filled in automatically' }) },
})
