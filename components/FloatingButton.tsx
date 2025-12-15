'use client'

import { Sparkles } from 'lucide-react'

interface FloatingButtonProps {
  visible: boolean
  onGenerate: () => void
}

export function FloatingButton({ visible, onGenerate }: FloatingButtonProps) {
  return (
    <div
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]
        transition-all duration-300 ease-out
        ${visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <button
        type="button"
        onClick={onGenerate}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:scale-105 h-12 px-6 py-3 shadow-lg shadow-primary/20"
      >
        <Sparkles className="w-4 h-4 text-accent" />
        차트 생성
      </button>
    </div>
  )
}
