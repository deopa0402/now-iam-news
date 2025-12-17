import { Sparkles } from 'lucide-react'
import type { TriggerablePDFButton } from '@/lib/pdfs'

interface SimplePDFButtonProps {
  button: TriggerablePDFButton
  scale: number
  onClick: () => void
}

export default function SimplePDFButton({ button, scale, onClick }: SimplePDFButtonProps) {
  return (
    <button
      className="absolute w-7 h-7 bg-primary/70 backdrop-blur-sm text-primary-foreground/90 rounded-full shadow-md hover:bg-primary/85 hover:scale-110 transition-all flex items-center justify-center group z-50 cursor-pointer"
      style={{
        left: `${button.position.x * scale}px`,
        top: `${button.position.y * scale}px`,
      }}
      onClick={onClick}
      title="AI 분석"
    >
      <Sparkles className="w-4 h-4" />
    </button>
  )
}
