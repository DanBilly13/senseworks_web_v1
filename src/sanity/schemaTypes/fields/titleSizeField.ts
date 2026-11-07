import { defineField } from 'sanity'

type TitleSize = 'h3' | 'h4' | 'h5' | 'h6'

// The type system's names (see globals.css): H3 is drawn as Title, H4
// and H5 as Subtitle (the same size since Nov 2026, so H5 is no longer
// offered — saved H5s were moved to H4), H6 at Body's size.
const LABEL: Record<TitleSize, string> = {
  h3: 'Title',
  h4: 'Subtitle',
  h5: 'Subtitle',
  h6: 'Body',
}

// Reused by blocks whose items pair a title with a description — see
// ItemHeading (src/components/ui/ItemHeading.tsx), which actually
// renders whichever level this resolves to. A block's own default and
// list may still name H5 (as they did before the merge); it's read as
// H4, the same size.
export const titleSizeField = (
  defaultSize: TitleSize = 'h4',
  sizes: TitleSize[] = ['h3', 'h4', 'h5'],
) => {
  const merged = (size: TitleSize): TitleSize => (size === 'h5' ? 'h4' : size)
  const list = [...new Set(sizes.map(merged))]
  return defineField({
    name: 'titleSize',
    title: 'Item title size',
    type: 'string',
    options: {
      list: list.map((value) => ({ title: LABEL[value], value })),
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: merged(defaultSize),
  })
}
