import { defineType } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// The interactive "Senseworks Stack" animation (six platform layers that
// open from one circle, with a caption per layer): its own navy panel, up
// to 1400px wide. Its text is built in (English/Swedish, following the
// page's language), so there's nothing to fill in.
export const stackAnimationBlock = defineType({
  name: 'stackAnimationBlock',
  title: 'Stack Animation',
  type: 'object',
  fields: [hiddenField, spacingField],
  preview: {
    prepare: () => ({ title: 'Stack Animation', subtitle: 'Six layers. One Senseworks.' }),
  },
})
