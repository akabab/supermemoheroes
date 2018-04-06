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
    case 'action': {
      const now = Date.now()
      const { action } = payload
      const diff = now - state.gcd

      if (diff < 1500) {
        if (diff < 250) return { ...state, queuedAction: action }
        return state
      }

      return {
        ...state,
        gcd: now,
        actions: Object.assign(actions, { [now]: action }),
        queuedAction: undefined
      }
    }
    default:
      console.log('No case for', payload.type)
      return state
  }
}