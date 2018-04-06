import './db.js'
import { dispatch, getState } from './store.js'
import { onRender, request } from './render.js'
import { Game } from './components.js'

const App = document.getElementById('app')
App.addEventListener('mousedown', e => {
  const t = e.target
  const id = t.dataset.id

  if (id === undefined || (t.state && t.state.class)) return

  e.target.style.transform = `scale(1.2)`

  setTimeout(() => {
    e.target.style.transform = `scale(1)`
    e.target.style.transition = `transform 300ms`
    setTimeout(() => e.target.style.transition = `transform 0ms`, 300)
  })

  const action = {
    type: 'flip',
    id
  }

  dispatch({ type: 'action', action })
})

const clear = onRender(() => {
  if (getState().waiting) {
    const url = `${location.origin}${location.pathname}?play=${getState().playId}`
    return App.innerHTML = `Waiting at <a href="${url}">${url}</a>`
  }
  if (!getState().players || !getState().cards.length) return
  App.innerHTML = Game(getState())
  const gcdElem = document.getElementById('gcd')
  const cards = Array.from(document.getElementsByClassName('card'))
  cards.forEach((c, i) => c.state = getState().cards[i])
  clear()
  setInterval(request, 100)
  const stop = onRender(() => {
    const state = getState()
    // scores = state.scores.length ? state.scores : scores

    // if (scores[0] + scores[1] === cards.length / 2) {
    //   const you = state.players[0] === state.playerId ? 0 : 1
    //   const them = Number(!you)
    //   App.innerHTML = scores[you] > scores[them]
    //     ? `You Won (${scores[you]} vs ${scores[them]})`
    //     : `You Loose (${scores[you]} vs ${scores[them]})`
    //   return stop()
    // }
    const now = Date.now()
    if (state.error) return App.innerHTML = state.error.message
    for (const card of cards) {
      const cl = card.classList
      const { ts, class: className } = card.state
      cl.toggle('flipped', !className && (!ts || ((now - ts) > 2700)))
      cl.add(className)
    }
    const diff = 1500 - (now - state.gcd)
    gcdElem.textContent = diff > 0 ? (diff/1000).toFixed(1) : ''
  })
})
