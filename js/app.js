import './db.js'
import { dispatch, getState } from './store.js'
import { onRender } from './render.js'
import { Game } from './components.js'

const App = document.getElementById('app')
App.addEventListener('mousedown', e => {
  const t = e.target
  const id = t.dataset.id

  if (id === undefined) return

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
    const url = `${location.origin}?play=${getState().playId}`
    return App.innerHTML = `Waiting at <a href="${url}">${url}</a>`
  }
  if (!getState().players) return
  App.innerHTML = Game(getState())
  const gcdElem = document.getElementById('gcd')
  const cards = document.getElementsByClassName('card')
  clear()
  const style = card => card.flipped
  onRender(() => {
    const state = getState()
    if (state.error) {
      return App.innerHTML = state.error.message
    }
    const now = Date.now()
    state.cards.forEach((card, i) => {
      cards[i].style.background = card.flipped
        ? `url(${card.hero.images.sm})`
        : `hotpink`
    })
    gcdElem.textContent = state.gcdDiff > 0 ? (state.gcdDiff/1000).toFixed(1) : ''
  })
})
