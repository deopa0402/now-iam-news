'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState, useEffect, useRef } from 'react'
import SimplePDFButton from './SimplePDFButton'
import type { TriggerablePDFButton } from '@/lib/pdfs'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface TriggerablePDFViewerProps {
  pdfUrl: string
  allButtons: TriggerablePDFButton[]
  activeButtons: TriggerablePDFButton[]
  onKeywordDetected: (buttonId: string) => void
  onButtonClick: (button: TriggerablePDFButton) => void
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
  allButtons,
  activeButtons,
  onKeywordDetected,
  onButtonClick,
}: TriggerablePDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(77)
  const [scale, setScale] = useState(1.0)
  const containerRef = useRef<HTMLDivElement>(null)

  // 텍스트 선택 감지
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim()

      if (selectedText && selectedText.length > 0) {
        // 정규화된 텍스트로 키워드 매칭
        const normalizedSelected = normalizeText(selectedText)

        // 현재 페이지의 버튼 중 매칭되는 키워드 찾기
        const matchedButton = allButtons.find(btn => {
          if (btn.page !== pageNumber) return false
          const normalizedKeyword = normalizeText(btn.triggerKeyword)
          return normalizedSelected.includes(normalizedKeyword) ||
                 normalizedKeyword.includes(normalizedSelected)
        })

        if (matchedButton) {
          onKeywordDetected(matchedButton.id)
          // 선택 해제
          selection?.removeAllRanges()
        }
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
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
    <div className="relative bg-gray-100 p-4 h-full overflow-auto" ref={containerRef}>
      {/* PDF 컨트롤 */}
      <div className="mb-4 flex gap-4 items-center justify-center bg-white p-3 rounded-lg shadow-sm sticky top-0 z-10">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageInput}
            className="w-16 px-2 py-1 border rounded text-center"
            min={1}
            max={numPages || 1}
          />
          <span className="text-sm text-slate-600">
            / {numPages || '?'}
          </span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages || 1)}
          className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            -
          </button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(s => Math.min(2.0, s + 0.1))}
            className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            +
          </button>
        </div>

        {/* 힌트 메시지 */}
        <div className="ml-auto text-sm text-slate-600 italic">
          키워드를 드래그하여 숨겨진 버튼을 찾아보세요
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
                onClick={() => onButtonClick(btn)}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}
