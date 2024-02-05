export interface Literature {
  title: string
  totalPages: number
  author: string | null
  isbn: string | null
  organization: string | null
  publishingHouse: string | null
  description: string | null
}

export interface GlyphPageAssociation {
  literature: Literature
  pages: number[]
}

export interface LiteratureQueryCreteria {
  type: 'title' | 'author' | 'organization' | 'publishingHouse'
  keyword: string
}
