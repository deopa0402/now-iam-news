'use client'

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
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 py-3 shadow-lg border"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>이미지 아이콘</title>
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        차트 생성
      </button>
    </div>
  )
}
