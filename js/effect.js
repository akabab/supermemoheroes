import { baseUrl } from './shared.js'
import { request } from './render.js'

const shuffle = arr => {
  let i = arr.length
  let j, tmp
  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1))
    tmp = arr[j]
    arr[j] = arr[i]
    arr[i] = tmp
  }

  return arr
}

const getHeroes = () => fetch(`${baseUrl}/all.json`)
  .then(response => response.json())

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const newDeck = (heroes, size = 6 * 5 / 2) => {
  heroes = shuffle([...heroes]).filter((hero, i) => i < size)

  const cards = shuffle(heroes.concat(heroes)
    .map((h, i) => ({ id: i, hero: h })))

  return cards
}

const fetchingHeroes = getHeroes()

let queuedAction, gcdTimeout, db
export const effect = async (state, payload, dispatch) => {
  request(state)
  console.log(payload.type)
  switch (payload.type) {
    case 'error': return console.log(state.error)
    case 'init-play': {
      const heroes = (await fetchingHeroes)
        .filter(hero => hero.images.xs.split('/xs/')[1] !== 'no-portrait.jpg')

      const cards = newDeck(heroes)

      db.cards.set(cards)

      return dispatch({
        type: 'update',
        state: {
          gcd: Date.now(),
          action: {}
        }
      })
    }
    case 'db': {
      db = payload.db
      db.cards.on('value', snapshot =>
        dispatch({ type: 'update', state: { cards: snapshot.val() } }))

      db.actions.on('child_added', snapshot =>
        dispatch({ type: 'action-display', action: snapshot.val() }))
      return
    }
    case 'gcd': {
      clearTimeout(gcdTimeout)
      if (state.gcdDiff < 0) return
      gcdTimeout = setTimeout(dispatch, 100, { type: 'gcd', gcd: state.gcd })
      return
    }
    case 'action-display': {
      const { action } = payload
      if (action.type === 'flip') {
        const card = state.cards[action.id]
        const match = state.cards
          .find(c => c.flipped && c.hero.id === card.hero.id && c !== card)

        if (match) {
          dispatch({
            pair: [ card, match ],
            type: 'pick-pair',
            class: action.player === state.playerId ? 'owned' : 'lost'
          })
        } else {
          setTimeout(dispatch, 2800, { type: 'unflip', id: payload.action.id })
        }
      }
      return
    }
    case 'action': {
      const now = Date.now()
      const { action } = payload
      const diff = now - state.gcd

      action.player = state.playerId

      clearTimeout(queuedAction)
      if (diff < 1500) {
        diff > 1200 && (queuedAction = setTimeout(dispatch, 1550 - diff, payload))
        return
      }
      dispatch({ type: 'gcd', gcd: now })
      return db.actions.child(now).set(action)
    }
  }
}
