'use client'
import { usePathname } from 'next/navigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { SenseworksStackAnimation } from '@/components/animations/SenseworksStack'

type StackAnimationBlockProps = {
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

// The interactive Senseworks Stack animation as a block of its own — not a
// Media "React animation", since it isn't a fixed canvas for the 7:5 frame:
// it sizes itself (full width up to 1400px, 500–640px tall) and brings its
// own navy panel. A boxed panel, so the boxed edge padding (8px on
// mobile). Its English/Swedish text follows the page's language.
export function StackAnimationBlock({ spacing = 'loose' }: StackAnimationBlockProps) {
  const language = (usePathname() ?? '').split('/')[1] === 'sv' ? 'sv' : 'en'
  return (
    <SectionShell px="boxed" py={spacing}>
      <SenseworksStackAnimation language={language} />
    </SectionShell>
  )
}
