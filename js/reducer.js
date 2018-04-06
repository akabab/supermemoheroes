const actionsReducer = (state, action) => {
  switch (action.type) {
    case 'flip': {
      state.cards[action.id].flipped = true
      return state
    }
  }
}

export const reducer = (state, payload) => {
  switch (payload.type) {
    case 'play': return { ...state, play: payload.state }
    case 'update': return { ...state, ...payload.state }
    case 'waiting-for-opponnent': return { ...state, waiting: true }
    case 'players': {
      if (payload.players[0] === payload.players[1]) {
        return { ...state, error: Error('You can not play against yourself') }
      }
      return { ...state, waiting: false, players: payload.players }
    }
    case 'error': return { ...state, error: payload.error }
    case 'action-display': return actionsReducer(state, payload.action)
    default:
      console.log('No case for', payload.type)
      return state
  }
}
