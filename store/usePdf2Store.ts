import { create } from 'zustand'
import type { TriggerablePDFButton } from '@/lib/pdfs2'

interface Pdf2Store {
  // 임시 버튼 (드래그로 생성, 클릭 전, 휘발성)
  temporaryButtons: string[]

  // 확정 버튼 (클릭 후, 세션 유지, 새로고침 시 사라짐)
  confirmedButtons: string[]

  // 열린 패널들 (runtime만)
  openPanels: Record<string, TriggerablePDFButton>

  // Actions
  addTemporaryButton: (buttonId: string) => void
  removeTemporaryButton: (buttonId: string) => void
  confirmButton: (buttonId: string) => void
  openPanel: (button: TriggerablePDFButton) => void
  closePanel: (buttonId: string) => void
  isButtonActive: (buttonId: string) => boolean
  isPanelOpen: (buttonId: string) => boolean
}

export const usePdf2Store = create<Pdf2Store>()((set, get) => ({
  temporaryButtons: [],
  confirmedButtons: [],
  openPanels: {},

  addTemporaryButton: (buttonId) =>
    set((state) => {
      console.log('🏪 [store] addTemporaryButton called:', buttonId)
      console.log('🏪 [store] Current temporaryButtons:', state.temporaryButtons)
      console.log('🏪 [store] Current confirmedButtons:', state.confirmedButtons)

      if (state.temporaryButtons.includes(buttonId) || state.confirmedButtons.includes(buttonId)) {
        console.log('🏪 [store] Button already exists, returning unchanged state')
        return state
      }

      const newState = {
        temporaryButtons: [...state.temporaryButtons, buttonId]
      }
      console.log('🏪 [store] New temporaryButtons:', newState.temporaryButtons)
      return newState
    }),

  removeTemporaryButton: (buttonId) =>
    set((state) => ({
      temporaryButtons: state.temporaryButtons.filter(id => id !== buttonId)
    })),

  confirmButton: (buttonId) =>
    set((state) => ({
      temporaryButtons: state.temporaryButtons.filter(id => id !== buttonId),
      confirmedButtons: [...state.confirmedButtons, buttonId]
    })),

  openPanel: (button) =>
    set((state) => ({
      openPanels: {
        ...state.openPanels,
        [button.id]: button
      }
    })),

  closePanel: (buttonId) =>
    set((state) => {
      const { [buttonId]: removed, ...rest } = state.openPanels
      return { openPanels: rest }
    }),

  isButtonActive: (buttonId) => {
    const state = get()
    return state.temporaryButtons.includes(buttonId) || state.confirmedButtons.includes(buttonId)
  },

  isPanelOpen: (buttonId) =>
    !!get().openPanels[buttonId]
}))
