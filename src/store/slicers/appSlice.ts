import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

export interface AppState {
  collapsed: boolean // 菜单收纳状态, 用于垂直布局
  menuMode: 'horizontal' | 'vertical' // 菜单模式, 用于水平布局
}

const initialState: AppState = {
  collapsed: false,
  menuMode: 'horizontal'
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCollapsed(state, action) {
      console.log('notify collapsed', action.payload)
      state.collapsed = action.payload
    },
    setMenuMode(state, action) {
      state.menuMode = action.payload
    }
  }
})

export const { setCollapsed, setMenuMode } = appSlice.actions

export const selectCollapsed = (state: RootState) => state.app.collapsed
export const selectMenuMode = (state: RootState) => state.app.menuMode

export default appSlice.reducer
