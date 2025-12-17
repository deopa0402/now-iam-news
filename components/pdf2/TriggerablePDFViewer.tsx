'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState, useEffect, useRef } from 'react'
import SimplePDFButton from './SimplePDFButton'
import type { TriggerablePDFButton } from '@/lib/pdfs2'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface TriggerablePDFViewerProps {
  pdfUrl: string
  initialPage: number
  allButtons: TriggerablePDFButton[]
  activeButtons: TriggerablePDFButton[]
  onKeywordDetected: (buttonId: string) => void
  onButtonClick: (button: TriggerablePDFButton, screenPosition: { x: number; y: number; width: number; height: number }) => void
}

// 텍스트 정규화 함수
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w가-힣]/g, '')
}

export default function TriggerablePDFViewer({
  pdfUrl,
  initialPage,
  allButtons,
  activeButtons,
  onKeywordDetected,
  onButtonClick,
}: TriggerablePDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(initialPage)
  const [scale, setScale] = useState(1.3)
  const containerRef = useRef<HTMLDivElement>(null)

  console.log('📺 [TriggerablePDFViewer] Rendering with activeButtons:', activeButtons.map(b => b.id))

  // 텍스트 선택 감지 (드래그 완료 시점에만)
  useEffect(() => {
    let isSelecting = false

    const handleMouseDown = () => {
      isSelecting = true
      console.log('🖱️ [mousedown] isSelecting:', isSelecting)
    }

    const handleMouseUp = () => {
      console.log('🖱️ [mouseup] isSelecting:', isSelecting)

      if (!isSelecting) {
        console.log('⚠️ [mouseup] Not selecting, returning early')
        return
      }
      isSelecting = false

      const selection = window.getSelection()
      const text = selection?.toString().trim()
      console.log('📝 [mouseup] Selected text:', JSON.stringify(text))

      if (text && text.length > 0) {
        const normalized = normalizeText(text)
        console.log('✅ [mouseup] Normalized text:', JSON.stringify(normalized))

        // 현재 페이지의 버튼 중 매칭되는 키워드 찾기
        console.log('🔍 [mouseup] Current page:', pageNumber)
        console.log('🔍 [mouseup] All buttons:', allButtons.map(b => ({ id: b.id, page: b.page, keyword: b.triggerKeyword })))

        const matchedButton = allButtons.find(btn => {
          if (btn.page !== pageNumber) {
            console.log(`⏭️ [mouseup] Skipping button ${btn.id} - wrong page (${btn.page} vs ${pageNumber})`)
            return false
          }
          const normalizedKeyword = normalizeText(btn.triggerKeyword)
          const matches = normalized.includes(normalizedKeyword) ||
                         normalizedKeyword.includes(normalized)
          console.log(`🔍 [mouseup] Comparing "${normalized}" with "${normalizedKeyword}" (${btn.id}): ${matches}`)
          return matches
        })

        console.log('🎯 [mouseup] Matched button:', matchedButton)

        if (matchedButton) {
          console.log('✅ [mouseup] Calling onKeywordDetected:', matchedButton.id)
          onKeywordDetected(matchedButton.id)
        } else {
          console.log('❌ [mouseup] No button matched')
        }
      } else {
        console.log('⚠️ [mouseup] No text selected or empty text')
      }
      // 선택 상태 유지 (removeAllRanges 제거)
    }

    console.log('🔧 [useEffect] Setting up event listeners')
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      console.log('🔧 [useEffect] Cleaning up event listeners')
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [allButtons, pageNumber, onKeywordDetected])

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages || prev, prev + 1))
  }

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number(e.target.value)
    if (page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page)
    }
  }

  return (
    <div className="relative bg-gray-100 h-full overflow-auto" ref={containerRef}>
      {/* PDF 컨트롤 */}
      <div className="mb-2 flex gap-3 items-center justify-center bg-white p-2 shadow-sm sticky top-0 z-10">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          이전
        </button>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageInput}
            className="w-14 px-2 py-1 border rounded text-center text-sm"
            min={1}
            max={numPages || 1}
          />
          <span className="text-xs text-slate-600">
            / {numPages || '?'}
          </span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages || 1)}
          className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          다음
        </button>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300 text-sm"
          >
            -
          </button>
          <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(s => Math.min(2.0, s + 0.1))}
            className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300 text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF 문서 */}
      <div className="flex justify-center">
        <div className="relative inline-block">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex items-center justify-center h-96">
                <div className="text-lg text-slate-600">PDF 로딩 중...</div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-96">
                <div className="text-lg text-red-600">PDF 로드 실패</div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="flex items-center justify-center h-96 bg-white">
                  <div className="text-slate-600">페이지 로딩 중...</div>
                </div>
              }
            />
          </Document>

          {/* 활성화된 버튼만 오버레이 */}
          {activeButtons
            .filter(btn => btn.page === pageNumber)
            .map(btn => (
              <SimplePDFButton
                key={btn.id}
                button={btn}
                scale={scale}
                onClick={(screenPosition) => onButtonClick(btn, screenPosition)}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}
