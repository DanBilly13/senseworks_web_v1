# Studio conventions

House rules for page blocks in Sanity Studio, so every block works the
same way for whoever is editing. Most of them are applied automatically
by `src/sanity/schemaTypes/blockConventions.ts` and checked by
`tests/blockConventions.test.ts`. The rest are for whoever writes a block.

## Applied automatically

- **Two tabs.** *Content* holds the copy in reading order: eyebrow,
  headline, body, button, second button, media, then items/cards/slides.
  *Design* holds the settings in a fixed order: layout/style, columns,
  type sizes, image position and ratio, background, alignment, width,
  padding, section spacing. *Hide block* is at the top of both.
- **Text boxes.** Headlines are 2 lines and Enter makes a line break.
  Body text is 5 lines, card/item text 4. Short labels stay one line.
- **Names.** The heading is always *Headline*, the text under it *Body*,
  the button *Button text* / *Button link*, whatever the field is called
  underneath.
- **No "(default)" in option labels.** Studio already shows the default
  picked when a block is added.

## For whoever writes a block

- **Background.** The block's colour fill is one field titled
  *Background*. Options, in this order, offering only the ones the block
  supports: None · Light grey · White · Dark · Accent · Accent gradient ·
  Dark accent gradient · Image. Use `bandFields()` for a full-width one.
  The colour of the cards inside a block is *Card style*, same words.
- **Sizes.** *Headline size* for the block's main heading, *Item title
  size* for cards and items (`titleSizeField`). A size only changes how
  big the text looks; the heading level stays automatic.
- **Switch or list.** A switch (boolean) shows or hides one thing and is
  named "Show …" or by what it turns on. Anything that could ever have a
  third option is a list. Two options are side-by-side radio buttons.
- **Optional images.** An image that changes the layout (a tint, a taller
  block, an extra column) gets a *None* option or a *Show image* switch,
  and the component checks `hasMedia()` / `hasImage()`
  (`src/lib/sanity/media.ts`), never just `if (media)`: clearing a
  picture in Studio leaves an empty object behind.
- **Defaults.** The same setting has the same default on every block,
  unless the block has a reason, which its help text explains.
- **Help text.** Every Design setting gets one line saying what it
  changes on the page.
- **Names and the menu.** Block titles follow "Family — Variant". Add a
  new block to a group in the *Add item* menu (`insertMenu` in
  `src/sanity/schemaTypes/page.ts`); an experimental one goes in
  *Experimental* and says so in its Component Library description.
- **Stored values never change casually.** Renaming a field or an
  option's value needs a content migration (drafts and page versions
  included). Changing a title, a description or the order is free.
