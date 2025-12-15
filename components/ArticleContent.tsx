'use client'

import Image from 'next/image'
import { useEffect } from 'react'

interface ContentBlock {
  type: 'paragraph' | 'image'
  content: string
  alt?: string
}

interface ImageMapping {
  blockIndex: number
  imageUrl: string
  alt?: string
}

interface DragInfo {
  blockIndex: number
  selectedText: string
}

interface ArticleContentProps {
  contentBlocks: ContentBlock[]
  imageMappings?: ImageMapping[]
  onTextDragged?: (info: DragInfo) => void
  onSelectionCleared?: () => void
}

export default function ArticleContent({ contentBlocks, imageMappings, onTextDragged, onSelectionCleared }: ArticleContentProps) {

  // 텍스트 선택 해제 감지
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim()

      // 선택이 사라지면 부모에게 알림
      if (!selectedText) {
        console.log('🧹 선택 해제됨 - 버튼 숨김')
        onSelectionCleared?.()
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [onSelectionCleared])

  const handleTextSelection = (blockIndex: number) => {
    console.log('🎯 ArticleContent: 드래그 감지됨!')
    console.log('📍 블록 인덱스:', blockIndex)

    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()

    console.log('📝 선택된 텍스트:', selectedText)
    console.log('📏 텍스트 길이:', selectedText?.length)

    // 텍스트가 10자 이상 선택되었는지 확인
    if (!selectedText || selectedText.length < 10) {
      console.log('❌ 텍스트가 너무 짧음 (10자 미만)')
      return
    }

    // 해당 블록에 이미지 매핑이 있는지 확인
    console.log('🔍 현재 imageMappings:', imageMappings)
    const hasMapping = imageMappings?.some(m => m.blockIndex === blockIndex)
    console.log('🎨 매핑 존재 여부:', hasMapping)

    if (!hasMapping) {
      console.log('❌ 이 블록은 이미지 매핑이 없음')
      return
    }

    // 페이지에게 드래그 정보 전달
    console.log('📤 페이지로 드래그 정보 전달!')
    onTextDragged?.({
      blockIndex,
      selectedText
    })
  }

  return (
    <div className="prose prose-lg max-w-none">
      {contentBlocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p
              key={`paragraph-${index}-${block.content.substring(0, 20)}`}
              className="text-foreground leading-relaxed mb-6 cursor-text"
              onMouseUp={() => handleTextSelection(index)}
            >
              {block.content}
            </p>
          )
        }
        if (block.type === 'image') {
          return (
            <div key={`image-${index}-${block.content}`} className="my-8">
              <Image
                src={block.content}
                alt={block.alt || '기사 이미지'}
                width={800}
                height={500}
                className="rounded-lg w-full h-auto"
              />
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
