import { create } from "zustand"

type AppState = {
  booting: boolean
  finishBoot: () => void
}

export const appStore = create<AppState>((set) => ({
  booting: true,
  finishBoot: () => set({ booting: false }),
}))
