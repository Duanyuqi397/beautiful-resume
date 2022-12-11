import { configureStore } from '@reduxjs/toolkit'

import reducer from './app'
import { setProps, add } from './app'
import undoable, {includeAction, groupByActionTypes} from 'redux-undo';
import { saver } from './autoSave'

const UNDO_CONFIG = {
  limit: 20,
  filter: includeAction([setProps.type, add.type]),
  groupBy: groupByActionTypes([setProps.type])
}

const AUTO_SAVE_CONFIG = {
  actions: [setProps.type]
}

export default configureStore({
  reducer: {
    app: undoable(reducer, UNDO_CONFIG)
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(saver.getMiddleWare())
  }
})
