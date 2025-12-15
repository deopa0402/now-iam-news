'use client'

import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { articles, type ContentBlock, type ImageMapping } from "@/lib/articles"
import { Button } from "@/components/ui/button"
import ArticleContent from "@/components/ArticleContent"
import { FloatingButton } from "@/components/FloatingButton"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { AIQuestions } from "@/components/AIQuestions"
import { Comments } from "@/components/Comments"
import { useState } from "react"

interface DragInfo {
  blockIndex: number
  selectedText: string
}

export default function ArticlePage() {
  const params = useParams()
  const id = params.id as string
  const article = articles.find((a) => a.id === id)

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(article?.contentBlocks || [])
  const [showButton, setShowButton] = useState(false)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!article) {
    notFound()
  }

  const handleTextDragged = (info: DragInfo) => {
    console.log('📢 페이지가 드래그 정보 받음:', info)
    setShowButton(true)
    setSelectedBlockIndex(info.blockIndex)
  }

  const handleGenerateImage = () => {
    console.log('🖼️ 페이지에서 이미지 생성 시작')
    if (selectedBlockIndex === null) return

    const mapping = article.imageMappings?.find(m => m.blockIndex === selectedBlockIndex)
    if (!mapping) return

    setShowButton(false)
    setIsGenerating(true)

    setTimeout(() => {
      const newBlocks = [...contentBlocks]
      newBlocks.splice(selectedBlockIndex + 1, 0, {
        type: 'image',
        content: mapping.imageUrl,
        alt: mapping.alt || '생성된 이미지'
      })

      console.log('✅ 페이지에서 이미지 블록 삽입 완료')
      setContentBlocks(newBlocks)
      setIsGenerating(false)
      setSelectedBlockIndex(null)
      window.getSelection()?.removeAllRanges()
    }, 2000)
  }

  const handleSelectionCleared = () => {
    console.log('🧹 선택 해제 - 버튼 숨김')
    setShowButton(false)
    setSelectedBlockIndex(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">뒤로 가기</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="pt-16">
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-8">
            {/* Article Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-secondary font-medium">{article.category}</span>
                </div>
                <span className="text-secondary font-medium">{article.source}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">{article.title}</h1>

              <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Content */}
            <ArticleContent
              contentBlocks={contentBlocks}
              imageMappings={article.imageMappings}
              onTextDragged={handleTextDragged}
              onSelectionCleared={handleSelectionCleared}
            />

            {/* Article Footer */}
            <div className="pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{article.source}</span> 에서 보도
                </div>
                <Button variant="outline" asChild>
                  <Link href="/">목록으로 돌아가기</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* AI Questions Section */}
        <AIQuestions
          predefined={article.aiQuestions?.predefined}
          customAnswerDemo={article.aiQuestions?.customAnswerDemo}
        />

        {/* Comments Section */}
        <Comments comments={article.comments} />
      </main>

      {/* Floating Button */}
      <FloatingButton
        visible={showButton}
        onGenerate={handleGenerateImage}
      />

      {/* Loading Overlay */}
      <LoadingOverlay visible={isGenerating} />
    </div>
  )
}
