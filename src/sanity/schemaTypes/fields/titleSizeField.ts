import { defineField } from 'sanity'

type TitleSize = 'h3' | 'h4' | 'h5'

const LABEL: Record<TitleSize, string> = {
  h3: 'H3',
  h4: 'H4',
  h5: 'H5',
}

// Reused by blocks whose items pair a title with a description — see
// ItemHeading (src/components/ui/ItemHeading.tsx), which actually
// renders whichever level this resolves to. `defaultSize` should
// match whatever that block already rendered before this field
// existed (H4 for Steps/Feature Grid/Dark Banner, H5 for Bento Grid),
// so every existing item keeps its current look and the "(default)"
// label stays honest.
export const titleSizeField = (defaultSize: TitleSize = 'h4') =>
  defineField({
    name: 'titleSize',
    title: 'Title size',
    type: 'string',
    options: {
      list: (['h3', 'h4', 'h5'] as TitleSize[]).map((value) => ({
        title: value === defaultSize ? `${LABEL[value]} (default)` : LABEL[value],
        value,
      })),
      layout: 'radio',
    },
    initialValue: defaultSize,
  })
