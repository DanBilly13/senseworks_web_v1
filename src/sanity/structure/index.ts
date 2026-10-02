import type { StructureResolver } from 'sanity/structure'
import { ComponentLibraryPane } from './ComponentLibraryPane'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton — opens its one document directly rather than a list.
      S.listItem()
        .title('Book a meeting')
        .id('bookMeetingSettings')
        .child(S.document().schemaType('bookMeetingSettings').documentId('bookMeetingSettings')),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'bookMeetingSettings'),
      S.divider(),
      S.listItem()
        .title('Component Library')
        .child(S.component(ComponentLibraryPane).title('Component Library')),
    ])
