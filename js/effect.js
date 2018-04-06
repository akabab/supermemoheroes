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
      state.gcd = Date.now()

      return
    }
    case 'db': {
      db = payload.db
      const cards = (await db.cards.once('value')).val()
      state.cards = cards
      const avgPing = []
      cards.forEach((c, i) =>
        c.pair = cards.find((b, j) => b.hero.id === c.hero.id && i !== j))
      db.actions.on('child_added', snapshot => {
        const action = snapshot.val()
        const card = cards[action.id]
        card.ts = Number(snapshot.key)
        card.player = action.player
        if ((card.ts - card.pair.ts) < 2800) {
          card.pair.owner = card.owner = action.player
          card.pair.ownedAt = card.ownedAt = card.ts
          card.pair.class = card.class = action.player === state.playerId
            ? 'owned'
            : 'lost'

          // const scores = [
          //   cards.filter(c => c.owner === state.playerId).length / 2,
          //   cards.filter(c => c.owner !== state.playerId).length / 2,
          // ]
          // dispatch({  type: 'update', state: { scores } })
        }
        request()
      })

      return
    }
    case 'action': {
      const now = Date.now()
      const { action } = payload
      const diff = now - state.gcd

      action.player = state.playerId

      console.log('actionnn')
      clearTimeout(queuedAction)
      if (diff < 1500) {
        diff > 1200 && (queuedAction = setTimeout(dispatch, 1550 - diff, payload))
        return
      }
      state.gcd = now
      return db.actions.child(now).set(action)
    }
  }
}
