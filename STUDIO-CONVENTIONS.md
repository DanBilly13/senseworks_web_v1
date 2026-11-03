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

## Adding a block: checklist

1. Schema in `src/sanity/schemaTypes/blocks/`, starting with
   `hiddenField`; use the shared fields (`spacingField`, `bandFields()`,
   `headlineSizeField()`, `titleSizeField()`, `headingLayoutField`,
   `contentWidthField`) rather than writing your own.
2. Register it in `src/sanity/schemaTypes/index.ts`, in the page's
   `blocks` list **and** one `insertMenu` group (`page.ts`), in
   `BlockRenderer.tsx`, and in `structure/componentLibrary.ts`.
3. Component in `src/components/blocks/`, using `SectionShell` /
   `SectionIntro`, with optional images checked by `hasMedia()` /
   `hasImage()`.
4. An example on the blocks gallery page (`src/app/[locale]/blocks`).
5. `yarn test`, then `npx sanity deploy` so editors get it.

## What's checked automatically

`yarn test` (and the *Checks* run GitHub does on every push and pull
request, `.github/workflows/checks.yml`) fails when a block:

- isn't registered in all four places, or is in no menu group or two;
- is missing the Content/Design tabs, doesn't start with *Hide block*,
  or doesn't end with *Section spacing*;
- has a Design setting without help text;
- offers a background outside the standard set or order, or stores an
  old value (`inverse`, `default`, `muted`);
- uses an old field name (`heading`, `size`, `headingLevel`);
- starts a shared setting (spacing, title size and style, image
  position, alignment) differently from other blocks without being on
  the deliberate list in `tests/blockRules.test.ts`;
- checks an image with `if (media)` instead of `hasMedia()` /
  `hasImage()`;
- has "(default)" in an option label, or a one-line headline box.
