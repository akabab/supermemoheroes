import { request } from './render.js'

// board: {
//   0: hero.id || null,
//   1: hero.id || null,
//   2: hero.id || null,
//   ...
//   29: hero.id || null
// },
// action: {
//   timeId
// }

let actionQueueTimeout
export const effect = async (state, payload, dispatch) => {
  request(state)
  switch (payload.type) {
    case 'init-play': {
      dispatch({
        type: 'state-update',
        state: {
          gcd: Date.now(),
          board: [],
          action: {}
        }
      })
    }
    case 'action': {
      clearTimeout(actionQueueTimeout)
      if (state.queuedAction !== payload.action) return
      actionQueueTimeout = setTimeout(dispatch, Date.now() - state.gcd, payload)
    }
  }
}
