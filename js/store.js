import { effect } from './effect.js'
import { reducer } from './reducer.js'

let state = { gcd: Date.now() } // initial State

const updateState = payload => {
  state = reducer(state, payload)
  effect(state, payload, dispatch)
}

export const dispatch = payload => setTimeout(updateState, 0, payload)
export const getState = () => state
