'use client'

import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Sparkles } from 'lucide-react'
import type { AIQuestion } from '@/lib/articles'

interface AIQuestionsProps {
  predefined?: AIQuestion[]
  customAnswerDemo?: string
}

export function AIQuestions({ predefined, customAnswerDemo }: AIQuestionsProps) {
  const [customQuestion, setCustomQuestion] = useState('')
  const [customAnswer, setCustomAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customQuestion.trim()) return

    setIsLoading(true)

    // 데모: 2초 후 미리 정의된 답변 표시
    setTimeout(() => {
      setCustomAnswer(
        customAnswerDemo ||
        '흥미로운 질문이네요! AI 기능은 현재 준비 중입니다. 곧 더 자세한 답변을 제공할 수 있을 예정입니다.'
      )
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">AI 추천 질문</h2>
      </div>

      {/* 미리 정의된 질문 (아코디언) */}
      {predefined && predefined.length > 0 ? (
        <Accordion type="single" collapsible className="mb-8">
          {predefined.map((qa, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                <span className="flex items-center gap-2">
                  <span className="text-primary font-semibold">Q.</span>
                  {qa.question}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6 text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">A.</span> {qa.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-center text-muted-foreground">
            이 기사와 관련된 추천 질문을 준비하고 있습니다.
            <br />
            아래에서 직접 질문해보세요!
          </p>
        </div>
      )}

      {/* 사용자 입력 질문 */}
      <div className="border rounded-lg p-6 bg-muted/30">
        <h3 className="font-semibold mb-4">직접 질문하기</h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="기사에 대해 궁금한 점을 물어보세요..."
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !customQuestion.trim()}>
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
          <div className="mt-6 p-4 bg-background rounded-lg border">
            <div className="text-sm text-muted-foreground mb-2">질문: {customQuestion}</div>
            <div className="text-foreground leading-relaxed">{customAnswer}</div>
          </div>
        )}
      </div>
    </div>
  )
}
