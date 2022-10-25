import { configureStore } from '@reduxjs/toolkit'

import reducer from './app'

export default configureStore({
  reducer: {
    app: reducer
  },
})
