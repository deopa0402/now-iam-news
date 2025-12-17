'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import AIQuestionPanel from '@/components/pdf2/AIQuestionPanel'
import { triggerablePdfReports } from '@/lib/pdfs2'
import { usePdf2Store } from '@/store/usePdf2Store'
import type { TriggerablePDFButton } from '@/lib/pdfs2'

// PDFViewer를 dynamic import로 SSR 비활성화
const TriggerablePDFViewer = dynamic(() => import('@/components/pdf2/TriggerablePDFViewer'), {
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

export default function PDF2Page() {
  const params = useParams()
  const id = params.id as string
  const pdfData = triggerablePdfReports.find(report => report.id === id)

  // Zustand store 사용
  const {
    temporaryButtons,
    confirmedButtons,
    openPanels,
    addTemporaryButton,
    removeTemporaryButton,
    confirmButton,
    openPanel,
    closePanel
  } = usePdf2Store()

  // 버튼 화면 좌표 저장
  const [buttonPositions, setButtonPositions] = useState<Record<string, ButtonPosition>>({})

  // 드래그로 키워드 감지 시 임시 버튼 추가
  const handleKeywordDetected = (buttonId: string) => {
    console.log('📥 [page] handleKeywordDetected called with:', buttonId)
    console.log('📥 [page] temporaryButtons before:', temporaryButtons)
    console.log('📥 [page] confirmedButtons before:', confirmedButtons)
    addTemporaryButton(buttonId)
    // Note: temporaryButtons won't update immediately here due to React state batching
  }

  // 다른 영역 클릭 시 임시 버튼 제거
  useEffect(() => {
    let justAdded = false

    const handleClickOutside = (e: MouseEvent) => {
      // 방금 드래그로 추가된 경우 무시
      if (justAdded) {
        console.log('⏭️ [handleClickOutside] Skipping - button just added')
        justAdded = false
        return
      }

      const target = e.target as HTMLElement

      // 버튼이 아닌 영역 클릭 시
      if (!target.closest('button[title="AI 분석"]')) {
        console.log('🗑️ [handleClickOutside] Removing temporary buttons')
        temporaryButtons.forEach(btnId => {
          if (!confirmedButtons.includes(btnId)) {
            removeTemporaryButton(btnId)
          }
        })
      }
    }

    // temporaryButtons가 변경되면 justAdded를 true로 설정
    if (temporaryButtons.length > 0) {
      justAdded = true
      console.log('🆕 [handleClickOutside] Button added, setting justAdded flag')
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [temporaryButtons, confirmedButtons, removeTemporaryButton])

  // 버튼 클릭 시: 임시 → 확정, 패널 열기
  const handleButtonClick = (
    button: TriggerablePDFButton,
    screenPosition: { x: number; y: number; width: number; height: number }
  ) => {
    // 버튼 화면 좌표 저장
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

    // 임시 버튼을 확정 버튼으로 전환
    confirmButton(button.id)

    // 패널 열기
    openPanel(button)
  }

  if (!pdfData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-slate-600">PDF를 찾을 수 없습니다.</div>
      </div>
    )
  }

  // 렌더링할 버튼 = 임시 + 확정
  const visibleButtonIds = [...temporaryButtons, ...confirmedButtons]
  const visibleButtons = pdfData.buttons.filter(btn => visibleButtonIds.includes(btn.id))

  console.log('🎨 [page] Rendering with:')
  console.log('  - temporaryButtons:', temporaryButtons)
  console.log('  - confirmedButtons:', confirmedButtons)
  console.log('  - visibleButtonIds:', visibleButtonIds)
  console.log('  - visibleButtons:', visibleButtons.map(b => b.id))

  return (
    <div className="relative h-screen overflow-hidden bg-gray-100">
      {/* PDF 전체 화면 */}
      <TriggerablePDFViewer
        pdfUrl={pdfData.pdfUrl}
        initialPage={pdfData.initialPage}
        allButtons={pdfData.buttons}
        activeButtons={visibleButtons}
        onKeywordDetected={handleKeywordDetected}
        onButtonClick={handleButtonClick}
      />

      {/* 패널들 - /pdf/1 스타일 (드래그 가능한 호버 패널) */}
      {Object.values(openPanels).map((button) => {
        const position = buttonPositions[button.id]
        return (
          <AIQuestionPanel
            key={button.id}
            button={button}
            isOpen={true}
            buttonScreenPosition={position}
            customAnswerDemo={button.customAnswerDemo}
            onClose={() => closePanel(button.id)}
            pdfId={id}
          />
        )
      })}
    </div>
  )
}
