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

let actionQueueTimeout
let db
export const effect = async (state, payload, dispatch) => {
  console.log(payload.type, state)
  request(state)
  switch (payload.type) {
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

      db.actions.on('child_added', snapshot => {
        const action = snapshot.val()
        if (action.player === state.playerId) return
        dispatch({ type: 'action', action })
      })
      return
    }
    case 'action': {
      const now = Date.now()
      clearTimeout(actionQueueTimeout)
      if (state.queuedAction !== payload.action) {
        if (action.player !== state.playerId) return
        return db.actions.child(now).set(payload.action)
      }
      actionQueueTimeout = setTimeout(dispatch, Date.now() - state.gcd, payload)
      return
    }
  }
}
