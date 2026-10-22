import type { ComponentType } from 'react'
import { UploadQueueLoop } from './UploadQueueLoop'
import { IntegrationCardStack } from './IntegrationCardStack'
import { BevisSidebarAnimation } from './BevisSidebarAnimation'
import { SettingsFormAnimation } from './SettingsFormAnimation'
import { SenseworksTableWalkthrough } from './SenseworksTableWalkthrough'
import { RosterFill } from './RosterFill'
import { CustomiseCanvas } from './CustomiseCanvas'
import { IntegrationsScreenAnimation } from './IntegrationsScreenAnimation'
import { AllyAnimation } from './AllyQuestion'

// Ally's canvas is an 852×852 square with its content in the centre
// band; shown in the site's 7:5 frame (852×608), shifted up 122px so that
// band sits in the middle.
function AllyQuestionAnimation({ paused }: { paused?: boolean }) {
  return (
    <div style={{ transform: 'translateY(-122px)' }}>
      <AllyAnimation paused={paused} />
    </div>
  )
}

type AnimationEntry = {
  // Every animation accepts `paused` — Media freezes it (not unmounts
  // it) once its frame scrolls out of view, so it resumes from where
  // it stopped instead of restarting from the beginning.
  component: ComponentType<{ paused?: boolean }>
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
  foretagTableAnimation: {
    component: SenseworksTableWalkthrough,
    canvas: { width: 700, height: 500 },
  } as AnimationEntry,
  rosterFillAnimation: {
    component: RosterFill,
    canvas: { width: 700, height: 500 },
  } as AnimationEntry,
  customiseAnimation: {
    component: CustomiseCanvas,
    canvas: { width: 700, height: 500 },
  } as AnimationEntry,
  integrationsScreenAnimation: {
    component: IntegrationsScreenAnimation,
    canvas: { width: 700, height: 500 },
  } as AnimationEntry,
  allyQuestionAnimation: {
    component: AllyQuestionAnimation,
    canvas: { width: 852, height: 608 },
  } as AnimationEntry,
} satisfies Record<string, AnimationEntry>

export type AnimationName = keyof typeof ANIMATION_COMPONENTS
