'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import AIQuestionPanel from '@/components/pdf/AIQuestionPanel'
import { pdfReports } from '@/lib/pdfs'
import type { PDFButton } from '@/lib/pdfs'

// PDFViewer를 dynamic import로 SSR 비활성화
const PDFViewer = dynamic(() => import('@/components/pdf/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-lg text-slate-600">PDF 뷰어 로딩 중...</div>
    </div>
  ),
})

interface ButtonPosition {
  buttonId: string
  screenX: number
  screenY: number
  width: number
  height: number
}

export default function PDFPage() {
  const params = useParams()
  const id = params.id as string

  // PDF 데이터 가져오기
  const pdfData = pdfReports.find(report => report.id === id)

  // 각 버튼별로 패널 열림 상태 관리
  const [openPanels, setOpenPanels] = useState<string[]>([])
  // 각 버튼의 화면 좌표 저장
  const [buttonPositions, setButtonPositions] = useState<Record<string, ButtonPosition>>({})

  const handleButtonClick = (button: PDFButton, screenPosition: { x: number; y: number; width: number; height: number }) => {
    // 버튼의 화면 좌표 저장
    setButtonPositions(prev => ({
      ...prev,
      [button.id]: {
        buttonId: button.id,
        screenX: screenPosition.x,
        screenY: screenPosition.y,
        width: screenPosition.width,
        height: screenPosition.height,
      }
    }))

    // 이미 열려있지 않은 경우에만 추가
    if (!openPanels.includes(button.id)) {
      setOpenPanels(prev => [...prev, button.id])
    }
  }

  const handlePanelClose = (buttonId: string) => {
    setOpenPanels(prev => prev.filter(id => id !== buttonId))
  }

  if (!pdfData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-slate-600">PDF를 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-100">
      {/* PDF 전체 화면 (중앙 배치) */}
      <PDFViewer
        pdfUrl={pdfData.pdfUrl}
        buttons={pdfData.buttons}
        onButtonClick={handleButtonClick}
      />

      {/* 각 버튼마다 독립적인 패널 - 버튼 우측 상단 대각선에 배치 */}
      {pdfData.buttons.map((button) => {
        const isOpen = openPanels.includes(button.id)
        const position = buttonPositions[button.id]
        return (
          <AIQuestionPanel
            key={button.id}
            button={button}
            isOpen={isOpen}
            buttonScreenPosition={position}
            customAnswerDemo={button.customAnswerDemo}
            onClose={() => handlePanelClose(button.id)}
          />
        )
      })}
    </div>
  )
}
