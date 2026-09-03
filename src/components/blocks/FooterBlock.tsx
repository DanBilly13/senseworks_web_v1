'use client'
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import Image from 'next/image'
import {
  GithubOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  XOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'
import { buttonVariants } from '@/components/ui/Button'

type FooterLink = { label: string; href: string }
type FooterLinkColumn = { title: string; links?: FooterLink[] }
type SocialPlatform = 'x' | 'linkedin' | 'github' | 'youtube' | 'instagram'
type SocialLink = { platform: SocialPlatform; href: string }
type FooterBlockProps = {
  linkColumns?: FooterLinkColumn[]
  newsletterHeading?: string
  newsletterPlaceholder?: string
  socialLinks?: SocialLink[]
  legalLinks?: FooterLink[]
  copyrightText?: string
}

const SOCIAL_ICON: Record<SocialPlatform, ReactNode> = {
  x: <XOutlined />,
  linkedin: <LinkedinOutlined />,
  github: <GithubOutlined />,
  youtube: <YoutubeOutlined />,
  instagram: <InstagramOutlined />,
}

function NewsletterForm({
  heading,
  placeholder,
}: {
  heading?: string
  placeholder?: string
}) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // D10: v1 forms are UI-only — validate and show the success state,
    // no real backend yet. D9: replace the form inline, no navigation.
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="text-body text-background/80">Thanks — you&rsquo;re on the list.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-small-medium sm:flex-row">
      <input
        type="email"
        required
        placeholder={placeholder}
        aria-label={heading ?? 'Email address'}
        className="w-full rounded-md border border-background/30 bg-transparent px-medium py-small-medium text-body-sm text-background placeholder:text-background/50 sm:max-w-prose-xs"
      />
      <button type="submit" className={buttonVariants({ variant: 'inverse', size: 'sm' })}>
        Subscribe
      </button>
    </form>
  )
}

export function FooterBlock({
  linkColumns = [],
  newsletterHeading,
  newsletterPlaceholder = 'you@company.com',
  socialLinks = [],
  legalLinks = [],
  copyrightText,
}: FooterBlockProps) {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto flex w-full max-w-page flex-col gap-3xl px-medium-large py-3xl">
        <div className="flex flex-col gap-3xl md:flex-row md:justify-between">
          <div className="flex w-full flex-col gap-medium md:max-w-prose-xs">
            <Image
              src="/senseworks-logo-neg.svg"
              alt="senseworks"
              width={240}
              height={31}
              className="h-medium-large w-auto self-start"
            />
            {newsletterHeading && (
              <p className="text-body text-background/80">{newsletterHeading}</p>
            )}
            <NewsletterForm heading={newsletterHeading} placeholder={newsletterPlaceholder} />
          </div>
          {linkColumns.length > 0 && (
            <div className="grid grid-cols-2 gap-large sm:grid-cols-3">
              {linkColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-small-medium">
                  <p className="text-caption font-semibold text-background/60 uppercase">
                    {column.title}
                  </p>
                  {column.links?.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-body-sm text-background/80 hover:text-background"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Oversized wordmark — purely visual, brand already announced
            accessibly by the logo above. */}
        <div className="w-full overflow-hidden" aria-hidden="true">
          <Image
            src="/senseworks-logo-neg.svg"
            alt=""
            width={240}
            height={31}
            className="h-auto w-full"
          />
        </div>

        <div className="flex flex-col gap-medium border-t border-background/20 pt-large md:flex-row md:items-center md:justify-between">
          {copyrightText && <p className="text-body-sm text-background/60">{copyrightText}</p>}
          {legalLinks.length > 0 && (
            <div className="flex flex-wrap gap-medium-large">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-background/60 hover:text-background"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          {socialLinks.length > 0 && (
            <div className="flex gap-medium">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  aria-label={social.platform}
                  className="text-background/60 hover:text-background"
                >
                  {SOCIAL_ICON[social.platform]}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
