import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { 
  AppContext, 
  ActivatePayload,
  DeactivatePayload,
  SetPropsPayload,
  DeletePayload,
  Component,
  RootComponent,
  SetStatePayload,
  RequestStatus,
  InitPayload,
} from '../types'

const DEFAULT_ROOT: RootComponent = {
  type: "div",
  id: "__root-container__",
  props: {
    id: "root-container",
    position: [0, 0],
    size: [635, 898],
    layer: 0,
    style: {
      backgroundColor: "white",
      position: "relative",
      margin: "auto",
    },
  },
  children: [],
  parent: '',
  canActive: false,
  canDrag: false
}


const initialState = {
    components: [DEFAULT_ROOT],
    actives: [],
    syncStatus: 'idle',
    resumeId: null
} as AppContext


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    add(state, action: PayloadAction<Component>){
      const newComponent = action.payload
      state.components.push(newComponent)
      state.components.forEach(c => {
        if(c.id === newComponent.parent){
          c.children.push(newComponent.id) 
        }
      })
    },

    init(state, action: PayloadAction<InitPayload>){
      const hasRoot = action.payload.components.some(c => c.id === DEFAULT_ROOT.id)
      state.components = hasRoot ? action.payload.components: [DEFAULT_ROOT, ...action.payload.components]
      state.resumeId = action.payload.resumeId
    },

    setProps(state, action: PayloadAction<SetPropsPayload[]>) {
      const componentMapping = new Map(state.components.map(c => [c.id, c]))
      for(const [id, props] of action.payload){
        const component = componentMapping.get(id)
        if(component){
          component.props = props
        }else{
          console.warn(`component ${id} not found`)
        } 
      }
    },

    activite(state, action: PayloadAction<ActivatePayload>){
      state.actives = action.payload
    },

    deactivite(state, action: PayloadAction<DeactivatePayload>){
      if(action.payload){
        state.actives = state.actives.filter(id => !(action.payload?.includes(id)))
      }else{
        state.actives = []
      }
    },

    setState(state, action: PayloadAction<SetStatePayload>){
      const componentMapping = new Map(state.components.map(c => [c.id, c]))
      action.payload.ids.forEach(id => {
        const component = componentMapping.get(id)
        if(component){
          component.state = action.payload.state
        }
      })
    },

    remove(state, action: PayloadAction<DeletePayload>){
      const componentMapping = new Map(state.components.map(c => [c.id, c]))
      const needDeleteIds = new Set(action.payload)
      needDeleteIds.delete(DEFAULT_ROOT.id) // can remove root component
      const needKeep = (id: string) => !needDeleteIds.has(id)
      const parents = state.components
           .filter(c => needDeleteIds.has(c.id))
           .map(c => c.parent)

      for(const parentId of parents){
        const parent = componentMapping.get(parentId)
        if(parent){
          // delete components from its' parent
          parent.children = parent.children.filter(needKeep)
        }
      }
      // delete components
      state.components = state.components.filter(c => needKeep(c.id))
    },

    syncStatus(state, action: PayloadAction<RequestStatus>){
      state.syncStatus = action.payload
    }
  }
})

export const { 
  add, 
  setProps, 
  activite, 
  deactivite, 
  remove,
  setState,
  init,
  syncStatus,
} = appSlice.actions
export { DEFAULT_ROOT}
export default appSlice.reducer