'use client'

import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { articles, type ContentBlock } from "@/lib/articles"
import { Button } from "@/components/ui/button"
import ArticleContent from "@/components/ArticleContent"
import { FloatingButton } from "@/components/FloatingButton"
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
  const [showAIQuestions, setShowAIQuestions] = useState(false)

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

    // 1단계: 로딩 블록 즉시 삽입
    const newBlocksWithLoading = [...contentBlocks]
    newBlocksWithLoading.splice(selectedBlockIndex + 1, 0, {
      type: 'loading',
      content: 'Generating image...'
    })
    setContentBlocks(newBlocksWithLoading)

    // 2단계: 2초 후 로딩 블록을 이미지 블록으로 교체
    setTimeout(() => {
      const newBlocksWithImage = [...newBlocksWithLoading]
      newBlocksWithImage[selectedBlockIndex + 1] = {
        type: 'image',
        content: mapping.imageUrl,
        alt: mapping.alt || '생성된 이미지',
        isGenerated: true // 보더 표시를 위한 플래그
      }

      console.log('✅ 페이지에서 이미지 블록 삽입 완료')
      setContentBlocks(newBlocksWithImage)
      setSelectedBlockIndex(null)
      setShowAIQuestions(true) // 차트 생성 완료 후 AI 질문 컴포넌트 표시
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
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  {article.category}
                </span>
                <span className="text-secondary font-semibold">{article.source}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">{article.title}</h1>

              <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
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

        {/* AI Questions Section - 차트 생성 후에만 표시 */}
        {showAIQuestions && (
          <AIQuestions
            predefined={article.aiQuestions?.predefined}
            customAnswerDemo={article.aiQuestions?.customAnswerDemo}
          />
        )}

        {/* Comments Section */}
        <Comments comments={article.comments} />
      </main>

      {/* Floating Button */}
      <FloatingButton
        visible={showButton}
        onGenerate={handleGenerateImage}
      />
    </div>
  )
}
