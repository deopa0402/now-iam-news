'use client'

import { useState, useEffect } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import type { AIQuestion } from '@/lib/articles'

interface AIQuestionsProps {
  predefined?: AIQuestion[]
  customAnswerDemo?: {
    answer: string
    explanation: string
  }
}

// 스트리밍 효과 유틸리티 함수 - 자연스러운 타이핑 효과
const streamText = async (
  fullText: string,
  onUpdate: (text: string) => void,
  baseSpeed: number = 40 // 기본 속도 (30ms → 40ms로 증가)
): Promise<void> => {
  const words = fullText.split(' ')
  let currentText = ''

  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? ' ' : '') + words[i]
    onUpdate(currentText)

    // 가변적인 딜레이 계산
    let delay = baseSpeed

    // 1. 기본 랜덤성 추가 (±30%)
    delay = delay * (0.7 + Math.random() * 0.6)

    // 2. 문장 부호 뒤에 긴 멈춤 (쉼표, 마침표 등)
    const lastChar = words[i].slice(-1)
    if (lastChar === ',' || lastChar === '.') {
      delay += 100 + Math.random() * 100 // 100~200ms 추가 멈춤
    } else if (lastChar === '。' || lastChar === '、') {
      delay += 80 + Math.random() * 80 // 한글 문장부호
    }

    // 3. 가끔 랜덤한 스터터링 (10% 확률로 긴 멈춤)
    if (Math.random() < 0.1) {
      delay += 150 + Math.random() * 150 // 150~300ms 추가 멈춤
    }

    // 4. 단어 길이에 따른 딜레이 (긴 단어는 약간 더 빠르게)
    if (words[i].length > 8) {
      delay *= 0.8
    }

    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

export function AIQuestions({ predefined, customAnswerDemo }: AIQuestionsProps) {
  const [customQuestion, setCustomQuestion] = useState('')
  const [customAnswer, setCustomAnswer] = useState('')
  const [customExplanation, setCustomExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingAnswers, setStreamingAnswers] = useState<Record<number, string>>({})
  const [streamingExplanations, setStreamingExplanations] = useState<Record<number, string>>({})
  const [loadingAnswers, setLoadingAnswers] = useState<Record<number, boolean>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customQuestion.trim()) return

    setIsLoading(true)
    setCustomAnswer('') // 이전 답변 초기화
    setCustomExplanation('') // 이전 해설 초기화

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

  const handleAccordionChange = async (value: string, index: number) => {
    // 이미 로딩 중이거나 답변이 완료된 경우 무시
    if (loadingAnswers[index] || streamingAnswers[index]) return

    if (!predefined || !predefined[index]) return

    const answerText = predefined[index].answer
    const explanationText = predefined[index].explanation

    // 로딩 시작
    setLoadingAnswers(prev => ({ ...prev, [index]: true }))

    // 1단계: 로딩 대기 (1초)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setLoadingAnswers(prev => ({ ...prev, [index]: false }))

    // 2단계: 답 스트리밍
    await streamText(answerText, (text) => {
      setStreamingAnswers(prev => ({ ...prev, [index]: text }))
    })

    // 3단계: 해설 스트리밍
    await streamText(explanationText, (text) => {
      setStreamingExplanations(prev => ({ ...prev, [index]: text }))
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Enhanced container with borders, gradient, and shadow */}
      <div className="border-2 border-primary/20 rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50/50 to-indigo-50/80 shadow-lg shadow-primary/10 border-t-4 border-t-primary overflow-hidden p-8">
        {/* Header with accent bar and icon */}
        <div className="border-l-4 border-l-primary pl-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">AI 추천 질문</h2>
          </div>
        </div>

        <div>
          {/* 미리 정의된 질문 (아코디언) */}
          {predefined && predefined.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              className="mb-6"
              onValueChange={(value) => {
                if (value) {
                  const index = parseInt(value.replace('item-', ''), 10)
                  handleAccordionChange(value, index)
                }
              }}
            >
              {predefined.map((qa, index) => (
                <AccordionItem
                  key={`question-${index}-${qa.question.substring(0, 20)}`}
                  value={`item-${index}`}
                  className="border-l-2 border-l-primary/30 pl-4"
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="text-primary font-bold text-lg">Q.</span>
                      <span className="font-medium">{qa.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-6 space-y-3">
                      {/* 답 */}
                      <div>
                        <span className="font-bold text-primary text-base">답:</span>{' '}
                        {loadingAnswers[index] ? (
                          <span className="inline-flex items-center gap-2 text-primary">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            답변 생성 중...
                          </span>
                        ) : streamingAnswers[index] ? (
                          <span className="font-semibold text-slate-900">{streamingAnswers[index]}</span>
                        ) : (
                          <span className="text-slate-500">답변을 불러오는 중...</span>
                        )}
                      </div>

                      {/* 해설 */}
                      {streamingExplanations[index] && (
                        <div className="pt-2 border-t border-slate-200">
                          <span className="font-bold text-slate-700 text-sm">해설:</span>{' '}
                          <span className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                            {streamingExplanations[index]}
                          </span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="mb-6 p-6 bg-white rounded-lg border-2 border-dashed border-primary/30">
              <p className="text-center text-slate-600">
                이 기사와 관련된 추천 질문을 준비하고 있습니다.
                <br />
                아래에서 직접 질문해보세요!
              </p>
            </div>
          )}

          {/* Dashed separator */}
          <div className="border-t-2 border-dashed border-primary/20 my-6" />

          {/* 사용자 입력 질문 */}
          <div className="rounded-lg p-6 bg-white border border-primary/20">
            <h3 className="font-semibold mb-4 text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              직접 질문하기
            </h3>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="기사에 대해 궁금한 점을 물어보세요..."
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                disabled={isLoading}
                className="flex-1 border-primary/30 focus-visible:ring-primary/50"
              />
              <Button
                type="submit"
                disabled={isLoading || !customQuestion.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    생각중...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    질문
                  </span>
                )}
              </Button>
            </form>

            {customAnswer && (
              <div className="mt-6 p-5 bg-white rounded-lg border-2 border-primary/30 shadow-sm space-y-3">
                {/* 답 */}
                <div>
                  <span className="font-bold text-primary text-base">답:</span>{' '}
                  <span className="font-semibold text-slate-900">{customAnswer}</span>
                </div>

                {/* 해설 */}
                {customExplanation && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700 text-sm">해설:</span>{' '}
                    <span className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                      {customExplanation}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
