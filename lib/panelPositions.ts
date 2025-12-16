// localStorage를 사용하여 패널 위치 저장/불러오기

const STORAGE_KEY = 'pdf-panel-positions'

export interface SavedPosition {
  x: number
  y: number
}

// 특정 버튼의 패널 위치 불러오기
export function getSavedPanelPosition(
  pdfId: string,
  buttonId: string
): SavedPosition | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const positions = JSON.parse(stored)
    const key = `${pdfId}-${buttonId}`
    return positions[key] || null
  } catch (error) {
    console.error('Failed to load panel position:', error)
    return null
  }
}

// 특정 버튼의 패널 위치 저장
export function savePanelPosition(
  pdfId: string,
  buttonId: string,
  position: SavedPosition
): void {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const positions = stored ? JSON.parse(stored) : {}
    const key = `${pdfId}-${buttonId}`

    positions[key] = position
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  } catch (error) {
    console.error('Failed to save panel position:', error)
  }
}

// 모든 패널 위치 초기화 (사용하지 않지만 나중을 위해)
export function clearAllPanelPositions(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear panel positions:', error)
  }
}
