// Triggerable button for pdf2 (keyword-based activation)
export interface TriggerablePDFButton {
  id: string
  page: number
  position: { x: number; y: number }
  triggerKeyword: string
  chartImage?: string
  panelConfig: {
    direction: 'left' | 'right'
    offsetX: number
    offsetY: number
  }
  fixedQuestions: Array<{
    question: string
    answer: string
    explanation: string
  }>
  customAnswerDemo?: {
    answer: string
    explanation: string
  }
}

export interface TriggerablePDFReport {
  id: string
  title: string
  pdfUrl: string
  initialPage: number
  buttons: TriggerablePDFButton[]
}

// Import JSON files
import pdf2Data from '@/data/pdfs2/2.json'

export const triggerablePdfReports: TriggerablePDFReport[] = [
  pdf2Data as TriggerablePDFReport,
]
