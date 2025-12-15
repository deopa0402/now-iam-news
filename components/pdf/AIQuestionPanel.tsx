'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, X, Sparkles } from 'lucide-react'
import type { PDFButton } from '@/lib/pdfs'

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
    }

    if (Math.random() < 0.1) {
      delay += 150 + Math.random() * 150
    }

    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

export default function AIQuestionPanel({ button, isOpen, buttonScreenPosition, customAnswerDemo, onClose }: AIQuestionPanelProps) {
  const [customQuestion, setCustomQuestion] = useState('')
  const [customAnswer, setCustomAnswer] = useState('')
  const [customExplanation, setCustomExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  // 패널 높이 측정
  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [customAnswer, customExplanation])

  // 버튼의 실제 화면 위치 기준으로 패널 위치 계산
  const OFFSET_X_LEFT = 250 // 좌측 여백 (더 멀리)
  const OFFSET_X_RIGHT = 16 // 우측 여백
  const OFFSET_Y_UP_BUTTON1 = 50 // 버튼1 위로 살짝
  const OFFSET_Y_UP_BUTTON2 = 220 // 버튼2 위로 많이
  const PANEL_WIDTH = 320 // 패널 너비

  // 버튼 ID에 따라 방향 결정
  // chart-77-1: 버튼 왼쪽에 패널 표시 (살짝 위로)
  // chart-77-2: 버튼 오른쪽에 패널 표시 (많이 위로)
  const isLeftSide = button.id === 'chart-77-1'

  const panelStyle = buttonScreenPosition ? (
    isLeftSide ? {
      // 버튼의 왼쪽, 살짝 위로
      left: `${buttonScreenPosition.screenX - PANEL_WIDTH - OFFSET_X_LEFT}px`,
      top: `${buttonScreenPosition.screenY - OFFSET_Y_UP_BUTTON1}px`,
    } : {
      // 버튼의 오른쪽, 많이 위로
      left: `${buttonScreenPosition.screenX + buttonScreenPosition.width + OFFSET_X_RIGHT}px`,
      top: `${buttonScreenPosition.screenY - OFFSET_Y_UP_BUTTON2}px`,
    }
  ) : {
    left: '0px',
    top: '0px',
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

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed w-80 bg-white/95 backdrop-blur-sm border border-primary/20 rounded-lg shadow-lg p-3 overflow-y-auto max-h-[450px] transition-all duration-300 z-50"
      style={panelStyle}
    >
      {/* 헤더 - 간소화 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" />
          AI 질문하기
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* 질문 입력 - 서브헤더 제거 */}
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
