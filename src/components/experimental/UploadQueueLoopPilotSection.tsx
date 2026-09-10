import { SectionShell } from '@/components/ui/SectionShell'
import { UploadQueueLoop } from './UploadQueueLoop'

// EXPERIMENTAL — see the override in src/app/[locale]/[...slug]/page.tsx.
// Exactly the frame MediaBlock uses (gradient surface, aspect-media
// ratio, rounded corners) so the section takes up the same footprint
// in the page as the mediaBlock it's replacing — the animation itself
// is shorter than that box on most viewports, so it's centered in the
// middle rather than stretched to fill it.
export function UploadQueueLoopPilotSection() {
  return (
    <SectionShell>
      <div className="bg-accent-gradient relative flex aspect-media w-full items-center justify-center overflow-hidden rounded-lg p-medium md:p-2xl">
        <UploadQueueLoop />
      </div>
    </SectionShell>
  )
}
