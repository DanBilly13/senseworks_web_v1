import { Badge, Flex } from '@sanity/ui'
import type { ObjectItemProps } from 'sanity'

// Wraps every item row in the page-builder's `blocks` array (see
// page.ts) so a block with its own "Hidden" toggle (see fields/
// hiddenField.ts) shows that status right in the list — Dan wanted
// to see it there without opening each block, after noticing the
// built-in Remove/Duplicate/Copy menu has no room for a custom
// action of its own (Studio's array-item menu isn't extensible).
// This only decorates the default row; every existing behavior
// (drag handle, the "..." menu, click-to-open) is untouched.
export function BlockListItem(props: ObjectItemProps) {
  const hidden = (props.value as { hidden?: boolean } | undefined)?.hidden

  if (!hidden) return props.renderDefault(props)

  return (
    <Flex align="center" gap={2} style={{ opacity: 0.5 }}>
      <div style={{ flex: 1, minWidth: 0 }}>{props.renderDefault(props)}</div>
      <Badge tone="caution" style={{ flexShrink: 0, marginRight: '2.5rem' }}>
        Hidden
      </Badge>
    </Flex>
  )
}
