'use client'
import { Fragment, useEffect, useRef, useState } from 'react'

// A headline that types itself out once on load, with an underscore
// cursor that blinks a few times when it's done and fades away (a hero's
// "Typing effect"). Purely visual:
//
// - Screen readers and search engines get the whole text at once (the
//   sr-only copy); the drawn text is aria-hidden.
// - The not-yet-typed letters are drawn too, just transparent, so the
//   heading holds its final size and line breaks from the first frame —
//   nothing below moves while it types, and the lines break exactly where
//   they'll end up (text-balance included).
// - With reduced motion on, the CSS shows the finished text straight away
//   (globals.css, .typing-rest), with no cursor.
//
// It starts once the headline is on screen (straight away for a hero at
// the top of the page).
//
// The cursor is an empty inline span (not an inline-block), so it adds no
// line-break opportunity between the letters it sits between.

const START_DELAY_MS = 300
const LETTER_MS = 50
// A little unevenness, so it reads as typed rather than metered.
const JITTER_MS = 25

function withLineBreaks(text: string) {
  return text.split('\n').map((line, i, lines) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ))
}

export function TypingText({ text, cursorClassName }: { text: string; cursorClassName?: string }) {
  const [typed, setTyped] = useState(0)
  const done = typed >= text.length
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let count = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const step = () => {
      count += 1
      setTyped(count)
      if (count < text.length) timer = setTimeout(step, LETTER_MS + (Math.random() * 2 - 1) * JITTER_MS)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      timer = setTimeout(step, START_DELAY_MS)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [text])

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {withLineBreaks(text.slice(0, typed))}
        <span className="relative">
          <span className={`typing-cursor ${done ? 'typing-cursor-done' : ''} ${cursorClassName ?? ''}`} />
        </span>
        <span className="typing-rest">{withLineBreaks(text.slice(typed))}</span>
      </span>
    </>
  )
}
