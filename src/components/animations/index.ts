import type { ComponentType } from 'react'
import { UploadQueueLoop } from './UploadQueueLoop'
import { IntegrationCardStack } from './IntegrationCardStack'

// A curated exception to "media is always a file" (image/video/lottie)
// — the same pattern as Feature Grid's icon field (D23): a fixed,
// code-defined set of animations, not an open upload. Adding a new
// one means building the component, registering it here, and adding
// its name to the media object's schema options list — all three, not
// just one.
export const ANIMATION_COMPONENTS = {
  uploadQueueLoop: UploadQueueLoop,
  integrationCardStack: IntegrationCardStack,
} satisfies Record<string, ComponentType>

export type AnimationName = keyof typeof ANIMATION_COMPONENTS
