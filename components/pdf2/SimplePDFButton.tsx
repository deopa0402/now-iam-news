import { useRef } from 'react'
import { Sparkles } from 'lucide-react'
import type { TriggerablePDFButton } from '@/lib/pdfs2'

interface SimplePDFButtonProps {
  button: TriggerablePDFButton
  scale: number
  onClick: (screenPosition: { x: number; y: number; width: number; height: number }) => void
}

export default function SimplePDFButton({ button, scale, onClick }: SimplePDFButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const position = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      }
      onClick(position)
    }
  }

  return (
    <button
      ref={buttonRef}
      className="absolute w-7 h-7 bg-primary/70 backdrop-blur-sm text-primary-foreground/90 rounded-full shadow-md hover:bg-primary/85 hover:scale-110 transition-all flex items-center justify-center group z-50 cursor-pointer"
      style={{
        left: `${button.position.x * scale}px`,
        top: `${button.position.y * scale}px`,
      }}
      onClick={handleClick}
      title="AI 분석"
    >
      <Sparkles className="w-4 h-4" />
    </button>
  )
}
