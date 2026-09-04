import type { StructureResolver } from 'sanity/structure'
import { ComponentLibraryPane } from './ComponentLibraryPane'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems(),
      S.divider(),
      S.listItem()
        .title('Component Library')
        .child(S.component(ComponentLibraryPane).title('Component Library')),
    ])
