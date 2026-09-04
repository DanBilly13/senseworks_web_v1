import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Media } from '@/components/ui/Media'

// The real lottie-react pulls in lottie-web, which probes canvas
// support as a side effect of import — crashes under jsdom regardless
// of which renderer is actually used. Mocked here so the Lottie
// render path can be tested without touching the real engine; Media
// itself lazy-loads the real package via next/dynamic in production.
vi.mock('lottie-react', () => ({
  Lottie: ({ src }: { src: string }) => <div data-testid="lottie-mock" data-src={src} />,
}))

describe('Media', () => {
  it('renders the grey placeholder with role=img and the given alt when no media is set', () => {
    render(<Media alt="Placeholder image" className="h-xl w-xl" />)
    expect(screen.getByRole('img', { name: 'Placeholder image' })).toBeInTheDocument()
  })

  it('renders the grey placeholder when mediaType is set but no asset has been uploaded yet', () => {
    render(<Media media={{ mediaType: 'video' }} alt="Placeholder image" className="h-xl w-xl" />)
    expect(screen.getByRole('img', { name: 'Placeholder image' })).toBeInTheDocument()
    expect(screen.queryByRole('video' as never)).not.toBeInTheDocument()
  })

  it('renders a real image and drops the placeholder role once an image asset exists', () => {
    render(
      <Media
        media={{ mediaType: 'image', image: { asset: { _ref: 'image-abc-800x600-jpg' } } }}
        alt="A real photo"
        className="h-xl w-xl"
      />,
    )
    expect(screen.getByAltText('A real photo')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'A real photo' })?.tagName).not.toBe('DIV')
  })

  it('renders a video element once a video asset exists', () => {
    const { container } = render(
      <Media
        media={{ mediaType: 'video', videoUrl: 'https://cdn.sanity.io/files/x/y/z.mp4' }}
        alt="A real video"
        className="h-xl w-xl"
      />,
    )
    const video = container.querySelector('video')
    expect(video).toHaveAttribute('src', 'https://cdn.sanity.io/files/x/y/z.mp4')
  })

  it('renders the Lottie player once a lottie asset exists', async () => {
    render(
      <Media
        media={{ mediaType: 'lottie', lottieUrl: 'https://cdn.sanity.io/files/x/y/z.json' }}
        alt="A real animation"
        className="h-xl w-xl"
      />,
    )
    expect(await screen.findByTestId('lottie-mock')).toHaveAttribute(
      'data-src',
      'https://cdn.sanity.io/files/x/y/z.json',
    )
  })

  it('uses the fallback element instead of a flat grey box when provided and no media is set', () => {
    render(
      <Media
        alt="Jane Doe"
        className="size-2xl rounded-full"
        fallback={<span data-testid="avatar-fallback" />}
      />,
    )
    expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument()
  })
})
