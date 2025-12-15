'use client'

interface LoadingOverlayProps {
  visible: boolean
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-card rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="font-medium">이미지 생성 중...</p>
            <p className="text-sm text-muted-foreground">AI가 분석하고 있습니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}
