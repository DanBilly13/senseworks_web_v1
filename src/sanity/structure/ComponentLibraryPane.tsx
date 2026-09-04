import { Box, Card, Container, Heading, Stack, Text } from '@sanity/ui'
import { COMPONENT_LIBRARY } from './componentLibrary'

export function ComponentLibraryPane() {
  return (
    <Box padding={4} height="fill" overflow="auto">
      <Container width={1}>
        <Stack gap={5}>
          <Stack gap={2}>
            <Heading size={2}>Component Library</Heading>
            <Text size={1} muted>
              Every block type a page can be built from. This is a reference list, kept up to
              date by hand — adding a new block means adding an entry here too.
            </Text>
          </Stack>
          <Stack gap={3}>
            {COMPONENT_LIBRARY.map((block) => (
              <Card key={block.type} padding={4} radius={2} border>
                <Stack gap={2}>
                  <Heading size={1}>{block.title}</Heading>
                  <Text size={1} muted>
                    {block.description}
                  </Text>
                  <Text size={0} muted style={{ fontFamily: 'monospace' }}>
                    {block.type}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
