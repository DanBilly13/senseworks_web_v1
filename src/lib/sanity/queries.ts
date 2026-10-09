import { groq } from 'next-sanity'

// Reused wherever a `media` object field needs resolving: `image`
// passes through as-is (urlFor() parses the raw asset ref client-side,
// no dereference needed), but video/lottie are `file` assets, which
// have no equivalent client-side URL builder — GROQ has to dereference
// asset->url here instead. Takes the field's path so it also works
// one hop through a reference (e.g. "logo" on a client doc, or
// "testimonial->media" once a testimonial reference is dereferenced).
// `as` names the output key — defaults to "media" to match the prop
// name every block/component expects, but a block with more than one
// `media`-typed field (e.g. heroBackdropBlock's `backgroundImage` and
// `showcaseMedia`) needs each projected under its own field name
// instead, or the second call's "media" key would silently clobber
// the first's in the same object literal.
export const mediaProjection = (path = 'media', as = 'media') => groq`
  "${as}": ${path}{
    mediaType,
    alt,
    image,
    "videoUrl": video.asset->url,
    "lottieUrl": lottie.asset->url,
    animation,
  }
`

// Real client logos with an actual image uploaded — used by the
// /blocks showcase page so its Logo Cloud demo isn't empty (the block
// has no text fallback, only images, so a Lorem Ipsum name alone
// renders nothing).
export const clientLogosQuery = groq`
  *[_type == "client" && defined(logo.image)] | order(name asc) {
    name,
    ${mediaProjection('logo')}
  }
`

// D12: requested locale first, fall back to English (default locale)
// when no translation exists yet — a missing translation is absence,
// not an error. Both language versions of a demo page use the same
// literal slug (e.g. "home") for v1 — a documented simplification;
// production content with per-locale slugs would need to resolve the
// fallback through translation.metadata instead.
export const pageBySlugAndLocaleQuery = groq`
  coalesce(
    *[_type == "page" && slug.current == $slug && language == $locale][0],
    *[_type == "page" && slug.current == $slug && language == "en"][0]
  ){
    title,
    language,
    "slug": slug.current,
    theme,
    seoTitle,
    seoDescription,
    blocks[]{
      ...,
      _type == "heroBlock" => { ${mediaProjection()} },
      _type == "heroImageOverlayCardBlock" => { ${mediaProjection()} },
      _type == "heroBackdropBlock" => {
        ${mediaProjection('backgroundImage', 'backgroundImage')},
        ${mediaProjection('showcaseMedia', 'showcaseMedia')}
      },
      _type == "featureSplitBlock" => { ${mediaProjection()} },
      _type == "featureSplitDarkBlock" => { ${mediaProjection()} },
      _type == "fiftyFiftyBannerBlock" => { ${mediaProjection()} },
      _type == "bentoGridBlock" => { items[]{ ..., ${mediaProjection()} } },
      _type == "mediaBlock" => { ${mediaProjection()} },
      _type == "fullWidthSingleBlock" => { ${mediaProjection()}, ${mediaProjection('media2', 'media2')} },
      _type == "horizontalScrollStackMediumBlock" => { slides[]{ ..., ${mediaProjection()} } },
      _type == "releaseCardsBlock" => { cards[]{ ..., ${mediaProjection()}, "team": team[]->{ name, photo } } },
      _type == "mediaCarouselBlock" => { slides[]{ ..., ${mediaProjection()} } },
      _type == "horizontalScrollStackBlock" => { panels[]{ ..., ${mediaProjection()} } },
      _type == "caseStudyGridBlock" => { items[]{ ..., ${mediaProjection()} } },
      _type == "logoCloudBlock" => { logos[]->{ name, ${mediaProjection('logo')} } },
      _type == "testimonialCarouselBlock" => {
        items[]->{ quote, authorName, authorRole, ${mediaProjection()} }
      },
      // The TeamMember fields (lib/sanity/team), never email.
      _type == "teamGridBlock" => {
        "members": select(
          count(members) > 0 => members[]->{ _id, name, role, photo, bio, linkedinUrl, xUrl },
          *[_type == "teamMember"] | order(name asc) { _id, name, role, photo, bio, linkedinUrl, xUrl }
        )
      },
      _type == "testimonialLargeBlock" => {
        "quote": testimonial->quote,
        "authorName": testimonial->authorName,
        "authorRole": testimonial->authorRole,
        ${mediaProjection('testimonial->media')}
      },
    }
  }
`
