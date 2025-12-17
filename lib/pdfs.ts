export interface FixedQuestion {
  question: string
  answer: string
  explanation: string
}

export interface PanelConfig {
  direction: 'left' | 'right'  // 패널이 버튼의 왼쪽 또는 오른쪽에 배치
  offsetX: number               // 버튼과 패널 사이의 수평 거리
  offsetY: number               // 패널을 위로 올릴 거리
}

export interface PDFButton {
  id: string
  page: number
  position: { x: number; y: number }
  label: string
  panelConfig: PanelConfig
  fixedQuestions: FixedQuestion[]
  customAnswerDemo: {
    answer: string
    explanation: string
  }
}

export interface PDFReport {
  id: string
  title: string
  pdfUrl: string
  buttons: PDFButton[]
}

// Triggerable button for pdf2 (keyword-based activation)
export interface TriggerablePDFButton {
  id: string
  page: number
  position: { x: number; y: number }
  triggerKeyword: string
  customAnswerDemo: {
    answer: string
    explanation: string
  }
}

export interface TriggerablePDFReport {
  id: string
  title: string
  pdfUrl: string
  buttons: TriggerablePDFButton[]
}

// Import JSON files
import pdf1Data from '@/data/pdfs/1.json'
import pdf2Data from '@/data/pdfs/2.json'

export const pdfReports: PDFReport[] = [
  pdf1Data as PDFReport,
]

export const triggerablePdfReports: TriggerablePDFReport[] = [
  pdf2Data as TriggerablePDFReport,
]
