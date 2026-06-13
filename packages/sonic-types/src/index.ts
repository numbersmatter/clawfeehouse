export type SonicCollectionMeta = {
  count: number
  limit: number
  offset: number
  total: number
  timestamp?: string
  cache?: boolean
  timing?: number
}

export type BlogPostStatus = "draft" | "published" | "archived"

export type BlogPostContentItem = {
  id?: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  featuredImage?: string | { url?: string; alt?: string; title?: string } | null
  author: string
  publishedAt?: string | null
  status?: BlogPostStatus
  tags?: string | string[] | null
  createdAt?: string
  updatedAt?: string
}

export type BlogPostsContentResponse = {
  data: BlogPostContentItem[]
  meta: SonicCollectionMeta
}

export type BlogPostCard = {
  title: string
  href: string
  description: string
  imageUrl: string
  date: string
  datetime: string
  author: {
    name: string
    imageUrl: string
  }
}