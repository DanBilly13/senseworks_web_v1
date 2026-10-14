import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { ArticleImage } from '@/components/knowledge-bank/ArticleImage'

// The rich-text body of a long-form page (a Knowledge Bank article, a
// customer story), laid out on the .article-grid text column — shared
// so both read identically.
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-medium text-article-body text-foreground">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-large mb-medium text-h4 font-bold text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-large mb-medium text-h4 font-semibold text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-large mb-medium text-h5 font-semibold text-foreground">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-medium border-l-2 border-border pl-medium text-body-lg text-muted-foreground italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-medium list-disc pl-medium-large text-article-body text-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-medium list-decimal pl-medium-large text-article-body text-foreground">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="underline underline-offset-4">
        {children}
      </a>
    ),
  },
  types: {
    // Breaks out of the text column (article-grid-wide) — these are
    // dense product screenshots that need real width to stay legible,
    // not inline illustrations that should match the prose width.
    image: ({ value }) => (
      <div className="article-grid-wide my-large overflow-hidden rounded-lg">
        <ArticleImage image={value} alt={value.alt ?? ''} />
      </div>
    ),
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text block shape, rendered generically via @portabletext/react
export function ArticleBody({ value }: { value: any[] }) {
  return <PortableText value={value} components={portableTextComponents} />
}
