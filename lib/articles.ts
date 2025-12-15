export interface ContentBlock {
  type: 'paragraph' | 'image' | 'loading' | 'subtitle'
  content: string
  alt?: string
  isGenerated?: boolean // 생성된 이미지인지 여부 (보더 표시용)
}

export interface ImageMapping {
  blockIndex: number
  imageUrl: string
  alt?: string
}

export interface AIQuestion {
  question: string
  answer: string
  explanation: string
}

export interface Comment {
  id: string
  author: string
  avatar?: string
  content: string
  timestamp: string
  likes: number
  replies?: number
}

export interface Article {
  id: string
  title: string
  excerpt: string
  contentBlocks: ContentBlock[]
  imageMappings?: ImageMapping[]
  aiQuestions?: {
    predefined: AIQuestion[]
    customAnswerDemo: {
      answer: string
      explanation: string
    }
  }
  comments?: Comment[]
  source: string
  date: string
  imageUrl: string
  category: string
}

// Import JSON files
import article1Data from '@/data/news/1.json'
import article2Data from '@/data/news/2.json'
import article3Data from '@/data/news/3.json'
import article4Data from '@/data/news/4.json'
import article5Data from '@/data/news/5.json'

export const articles: Article[] = [
  article1Data as Article,
  article2Data as Article,
  article3Data as Article,
  article4Data as Article,
  article5Data as Article,
]
