import type { StructureResolver } from 'sanity/structure'
import { ComponentLibraryPane } from './ComponentLibraryPane'

const SINGLETONS = ['siteNavigation', 'bookMeetingSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singletons — each opens its one document directly rather than a list.
      S.listItem()
        .title('Site navigation')
        .id('siteNavigation')
        .child(S.document().schemaType('siteNavigation').documentId('siteNavigation')),
      S.listItem()
        .title('Book a meeting')
        .id('bookMeetingSettings')
        .child(S.document().schemaType('bookMeetingSettings').documentId('bookMeetingSettings')),
      ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() ?? '')),
      S.divider(),
      S.listItem()
        .title('Component Library')
        .child(S.component(ComponentLibraryPane).title('Component Library')),
    ])
