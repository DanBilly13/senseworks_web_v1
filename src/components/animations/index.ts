import type { ComponentType } from 'react'
import { UploadQueueLoop } from './UploadQueueLoop'
import { IntegrationCardStack } from './IntegrationCardStack'
import { BevisSidebarAnimation } from './BevisSidebarAnimation'
import { SettingsFormAnimation } from './SettingsFormAnimation'

type AnimationEntry = {
  component: ComponentType
  // Present only for animations built on the fixed-canvas pattern (see
  // the animation-export prompt) — Media wraps these in ScaledCanvas
  // so they scale uniformly, preserving any deliberate crop, instead
  // of reflowing. Omit it for a component that's already responsive
  // on its own terms (e.g. UploadQueueLoop's flexible panel layout).
  canvas?: { width: number; height: number }
}

// A curated exception to "media is always a file" (image/video/lottie)
// — the same pattern as Feature Grid's icon field (D23): a fixed,
// code-defined set of animations, not an open upload. Adding a new
// one means building the component, registering it here, and adding
// its name to the media object's schema options list — all three, not
// just one.
export const ANIMATION_COMPONENTS = {
  uploadQueueLoop: { component: UploadQueueLoop } as AnimationEntry,
  integrationCardStack: {
    component: IntegrationCardStack,
    canvas: { width: 700, height: 500 },
  } as AnimationEntry,
  bevisSidebarAnimation: {
    component: BevisSidebarAnimation,
    canvas: { width: 700, height: 500 },
  } as AnimationEntry,
  settingsFormAnimation: {
    component: SettingsFormAnimation,
    canvas: { width: 700, height: 500 },
  } as AnimationEntry,
} satisfies Record<string, AnimationEntry>

export type AnimationName = keyof typeof ANIMATION_COMPONENTS
