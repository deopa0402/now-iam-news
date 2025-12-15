export interface PDFButton {
  id: string
  page: number
  position: { x: number; y: number }
  label: string
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

// Import JSON files
import pdf1Data from '@/data/pdfs/1.json'

export const pdfReports: PDFReport[] = [
  pdf1Data as PDFReport,
]
