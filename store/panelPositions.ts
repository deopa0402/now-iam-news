import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface PanelPosition {
  x: number
  y: number
}

interface PanelPositionState {
  // positions 저장: key는 `${pdfId}-${buttonId}` 형식
  positions: Record<string, PanelPosition>

  // 위치 설정
  setPosition: (pdfId: string, buttonId: string, position: PanelPosition) => void

  // 위치 가져오기
  getPosition: (pdfId: string, buttonId: string) => PanelPosition | undefined

  // 특정 패널 위치 리셋
  resetPosition: (pdfId: string, buttonId: string) => void

  // 모든 위치 리셋
  resetAllPositions: () => void
}

export const usePanelPositionStore = create<PanelPositionState>()(
  devtools(
    persist(
      (set, get) => ({
        positions: {},

        setPosition: (pdfId, buttonId, position) => {
          const key = `${pdfId}-${buttonId}`
          set(
            (state) => ({
              positions: {
                ...state.positions,
                [key]: position,
              },
            }),
            false,
            `setPosition: ${key}`
          )
        },

        getPosition: (pdfId, buttonId) => {
          const key = `${pdfId}-${buttonId}`
          return get().positions[key]
        },

        resetPosition: (pdfId, buttonId) => {
          const key = `${pdfId}-${buttonId}`
          set(
            (state) => {
              const newPositions = { ...state.positions }
              delete newPositions[key]
              return { positions: newPositions }
            },
            false,
            `resetPosition: ${key}`
          )
        },

        resetAllPositions: () => {
          set({ positions: {} }, false, 'resetAllPositions')
        },
      }),
      {
        name: 'pdf-panel-positions', // localStorage key
      }
    ),
    {
      name: 'PanelPositions', // Redux DevTools에 표시될 이름
      enabled: true, // 디버깅 모드 활성화
    }
  )
)
