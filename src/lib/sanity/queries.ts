import { groq } from 'next-sanity'

// Reused wherever a `media` object field needs resolving: `image`
// passes through as-is (urlFor() parses the raw asset ref client-side,
// no dereference needed), but video/lottie are `file` assets, which
// have no equivalent client-side URL builder — GROQ has to dereference
// asset->url here instead.
const mediaProjection = groq`
  "media": media{
    mediaType,
    alt,
    image,
    "videoUrl": video.asset->url,
    "lottieUrl": lottie.asset->url,
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
    blocks[]{
      ...,
      _type == "heroBlock" => { ${mediaProjection} },
      _type == "featureSplitBlock" => { ${mediaProjection} },
      _type == "bentoGridBlock" => { items[]{ ..., ${mediaProjection} } },
      _type == "caseStudyGridBlock" => { items[]{ ..., ${mediaProjection} } },
      _type == "logoCloudBlock" => { logos[]{ ..., ${mediaProjection} } },
      _type == "testimonialCarouselBlock" => { items[]{ ..., ${mediaProjection} } },
    }
  }
`
