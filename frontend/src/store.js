import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import playVideoReducer from './features/video/playVideo'

export const store = configureStore({
  reducer: {
    auth:authReducer,
    playVideo: playVideoReducer,
  },
})