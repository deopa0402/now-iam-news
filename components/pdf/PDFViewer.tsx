'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'
import PDFButton from './PDFButton'
import type { PDFButton as PDFButtonType } from '@/lib/pdfs'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  pdfUrl: string
  buttons: PDFButtonType[]
  onButtonClick: (button: PDFButtonType, screenPosition: { x: number; y: number; width: number; height: number }) => void
}

export default function PDFViewer({ pdfUrl, buttons, onButtonClick }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(77)
  const [scale, setScale] = useState(1.0)

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
    <div className="relative bg-gray-100 p-4 h-full overflow-auto">
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

          {/* 버튼 오버레이 */}
          {buttons
            .filter(btn => btn.page === pageNumber)
            .map(btn => (
              <PDFButton
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
