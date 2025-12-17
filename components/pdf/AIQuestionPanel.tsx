'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Send, X, Sparkles, GripVertical } from 'lucide-react'
import type { PDFButton } from '@/lib/pdfs'
import { usePanelPositionStore } from '@/store/panelPositions'

interface ButtonScreenPosition {
  buttonId: string
  screenX: number
  screenY: number
  width: number
  height: number
}

interface AIQuestionPanelProps {
  button: PDFButton
  isOpen: boolean
  buttonScreenPosition?: ButtonScreenPosition
  customAnswerDemo?: {
    answer: string
    explanation: string
  }
  onClose: () => void
  pdfId: string  // localStorage key를 위한 PDF ID
}

// 스트리밍 효과 유틸리티 함수
const streamText = async (
  fullText: string,
  onUpdate: (text: string) => void,
  baseSpeed: number = 40
): Promise<void> => {
  const words = fullText.split(' ')
  let currentText = ''

  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? ' ' : '') + words[i]
    onUpdate(currentText)

    let delay = baseSpeed
    delay = delay * (0.7 + Math.random() * 0.6)

    const lastChar = words[i].slice(-1)
    if (lastChar === ',' || lastChar === '.') {
      delay += 100 + Math.random() * 100
    } else if (lastChar === '。' || lastChar === '、') {
      // 한글 문장부호 지원
      delay += 80 + Math.random() * 80
    }

    if (Math.random() < 0.1) {
      delay += 150 + Math.random() * 150
    }

    // 긴 단어는 더 빠르게 처리
    if (words[i].length > 8) {
      delay *= 0.8
    }

    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

export default function AIQuestionPanel({ button, isOpen, buttonScreenPosition, customAnswerDemo, onClose, pdfId }: AIQuestionPanelProps) {
  const [customQuestion, setCustomQuestion] = useState('')
  const [customAnswer, setCustomAnswer] = useState('')
  const [customExplanation, setCustomExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  // 고정 QA 스트리밍 state
  const [streamingQAIndex, setStreamingQAIndex] = useState<number | null>(null)
  const [streamingQAAnswers, setStreamingQAAnswers] = useState<Record<number, string>>({})
  const [streamingQAExplanations, setStreamingQAExplanations] = useState<Record<number, string>>({})
  const [loadingQAAnswers, setLoadingQAAnswers] = useState<Record<number, boolean>>({})

  // Zustand store에서 패널 위치 관리
  const { getPosition, setPosition: savePosition } = usePanelPositionStore()
  const [defaultPosition, setDefaultPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [hasCalculatedPosition, setHasCalculatedPosition] = useState(false)

  // 드래그 상태 관리
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })

  // 🐛 디버깅: 컴포넌트 렌더링 확인
  console.log('🎨 AIQuestionPanel render:', {
    buttonId: button.id,
    isOpen,
    hasButtonPosition: !!buttonScreenPosition,
    buttonScreenPosition,
    defaultPosition,
    hasCalculatedPosition,
    pdfId
  })

  // 패널 높이 측정
  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [customAnswer, customExplanation])

  // 초기 위치 계산 (Zustand store 또는 panelConfig 기반)
  useEffect(() => {
    console.log('🔄 useEffect [position calculation]:', {
      hasButtonPosition: !!buttonScreenPosition,
      isOpen,
      hasCalculatedPosition
    })

    if (!buttonScreenPosition || !isOpen || hasCalculatedPosition) return

    // 1순위: Zustand store에서 사용자가 설정한 위치
    const savedPosition = getPosition(pdfId, button.id)
    console.log('💾 Saved position from Zustand:', savedPosition)

    if (savedPosition) {
      console.log('✅ Using saved position:', savedPosition)
      setDefaultPosition(savedPosition)
      setCurrentPosition(savedPosition)
      setHasCalculatedPosition(true)
      return
    }

    // 2순위: JSON의 panelConfig 기반 계산
    const config = button.panelConfig
    const PANEL_WIDTH = 320

    let x = 0
    let y = 0

    if (config.direction === 'left') {
      x = buttonScreenPosition.screenX - PANEL_WIDTH - config.offsetX
    } else {
      x = buttonScreenPosition.screenX + buttonScreenPosition.width + config.offsetX
    }
    y = buttonScreenPosition.screenY - config.offsetY

    console.log('🧮 Calculated position:', { x, y, config, buttonScreenPosition })
    setDefaultPosition({ x, y })
    setCurrentPosition({ x, y })
    setHasCalculatedPosition(true)
  }, [buttonScreenPosition, button, isOpen, pdfId, getPosition, hasCalculatedPosition])

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 드래그 핸들 영역에서만 드래그 시작
    const target = e.target as HTMLElement
    if (!target.closest('.drag-handle')) return

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y
    })
    console.log('🖱️ Drag started')
  }

  // 드래그 중 - 전역 이벤트로 처리
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }
      setCurrentPosition(newPosition)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      console.log('🖱️ Drag ended, saving position:', currentPosition)
      // Zustand에 위치 저장
      savePosition(pdfId, button.id, currentPosition)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, currentPosition, pdfId, button.id, savePosition])

  // 고정 QA 아코디언 열릴 때 스트리밍 시작
  const handleAccordionChange = async (value: string, index: number) => {
    // 로딩 중이거나 이미 스트리밍된 QA는 다시 스트리밍하지 않음
    if (loadingQAAnswers[index] || streamingQAAnswers[index]) return

    const fq = button.fixedQuestions[index]
    if (!fq) return

    // 로딩 시작
    setLoadingQAAnswers(prev => ({ ...prev, [index]: true }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoadingQAAnswers(prev => ({ ...prev, [index]: false }))

    // 답변 스트리밍
    await streamText(fq.answer, (text) => {
      setStreamingQAAnswers(prev => ({ ...prev, [index]: text }))
    })

    // 해설 스트리밍
    await streamText(fq.explanation, (text) => {
      setStreamingQAExplanations(prev => ({ ...prev, [index]: text }))
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customQuestion.trim()) return

    setIsLoading(true)
    setCustomAnswer('')
    setCustomExplanation('')

    // 1단계: 로딩 (1.5초)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const answerText = customAnswerDemo?.answer || '세대 간 인식 차이'
    const explanationText = customAnswerDemo?.explanation ||
      'AI 기능은 현재 준비 중입니다. 곧 더 자세한 답변을 제공할 수 있을 예정입니다.'

    setIsLoading(false)

    // 2단계: 답 스트리밍
    await streamText(answerText, (text) => {
      setCustomAnswer(text)
    })

    // 3단계: 해설 스트리밍
    await streamText(explanationText, (text) => {
      setCustomExplanation(text)
    })
  }

  if (!isOpen) {
    console.log('❌ Panel NOT rendering - isOpen is false')
    return null
  }

  console.log('✅ Panel IS rendering with position:', currentPosition)

  return (
    <div
      ref={panelRef}
      onMouseDown={handleMouseDown}
      className="fixed w-80 bg-white/95 backdrop-blur-sm border border-primary/20 rounded-lg shadow-lg p-3 overflow-y-auto max-h-[450px]"
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        zIndex: 9998,
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: isDragging ? 'none' : 'auto'
      }}
    >
        {/* 헤더 - 드래그 핸들 포함 */}
        <div className="flex items-center justify-between mb-3 drag-handle cursor-move">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <GripVertical className="w-4 h-4 text-slate-400" />
            <Sparkles className="w-4 h-4 text-primary" />
            AI 질문하기
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

      {/* 고정 질문 - 아코디언 */}
      {button.fixedQuestions && button.fixedQuestions.length > 0 && (
        <>
          <Accordion
            type="single"
            collapsible
            className="mb-3"
            onValueChange={(value) => {
              if (value) {
                const index = parseInt(value.replace('item-', ''), 10)
                handleAccordionChange(value, index)
              }
            }}
          >
            {button.fixedQuestions.map((fq, index) => {
              const isLoadingThis = loadingQAAnswers[index]
              const streamedAnswer = streamingQAAnswers[index]
              const streamedExplanation = streamingQAExplanations[index]

              return (
                <AccordionItem key={`${button.id}-fq-${index}`} value={`item-${index}`}>
                  <AccordionTrigger className="text-xs font-medium text-slate-700 hover:text-primary py-2 text-left">
                    {fq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-600 space-y-2 pt-2">
                    {isLoadingThis ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="animate-spin">⏳</span>
                        <span>생각 중...</span>
                      </div>
                    ) : streamedAnswer ? (
                      <>
                        <div>
                          <span className="font-bold text-primary">답:</span>{' '}
                          <span className="font-medium text-slate-900">
                            {streamedAnswer}
                          </span>
                        </div>
                        {streamedExplanation && (
                          <div className="pt-1.5 border-t border-slate-200">
                            <span className="font-bold text-slate-700">해설:</span>{' '}
                            <span className="text-slate-700 leading-relaxed whitespace-pre-line">
                              {streamedExplanation}
                            </span>
                          </div>
                        )}
                      </>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
          <Separator className="mb-3" />
        </>
      )}

      {/* 질문 입력 */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <Input
          type="text"
          placeholder="차트에 대해 궁금한 점을 물어보세요..."
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          disabled={isLoading}
          className="flex-1 text-sm border-primary/30 focus-visible:ring-primary/50"
        />
        <Button
          type="submit"
          disabled={isLoading || !customQuestion.trim()}
          className="bg-primary hover:bg-primary/90"
          size="sm"
        >
          {isLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* 답변 표시 - 패딩 최적화 */}
      {customAnswer && (
        <div className="p-3 bg-primary/5 rounded-md border border-primary/20 space-y-2">
          {/* 답 */}
          <div>
            <span className="font-bold text-primary text-sm">답:</span>{' '}
            <span className="font-medium text-slate-900 text-sm">{customAnswer}</span>
          </div>

          {/* 해설 */}
          {customExplanation && (
            <div className="pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 text-sm">해설:</span>{' '}
              <span className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {customExplanation}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
