import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// The Releases page's list of every Release document, in three stacked
// sections: Rolling out (freshest news first), Shipped (grouped by month,
// last six months, then "Show earlier releases"), In development (last,
// so the page leads with what customers can use today). Category chips
// at the top filter all three; an empty section is hidden. The releases
// themselves are edited under "Release" in Studio — this block only
// holds the section headings.
export const releaseTimelineBlock = defineType({
  name: 'releaseTimelineBlock',
  title: 'Releases Timeline',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'rollingOutHeading', title: 'Rolling out: heading', type: 'string', initialValue: 'Rolling out' }),
    defineField({ name: 'rollingOutBody', title: 'Rolling out: text', type: 'text', rows: 2 }),
    defineField({ name: 'shippedHeading', title: 'Shipped: heading', type: 'string', initialValue: 'Shipped' }),
    defineField({ name: 'shippedBody', title: 'Shipped: text', type: 'text', rows: 2 }),
    defineField({ name: 'developmentHeading', title: 'In development: heading', type: 'string', initialValue: 'In development' }),
    defineField({ name: 'developmentBody', title: 'In development: text', type: 'text', rows: 2 }),
    spacingField,
  ],
  preview: { prepare: () => ({ title: 'Releases Timeline', subtitle: 'Every release: rolling out, shipped by month, in development' }) },
})
