import './db.js'
import { dispatch, getState } from './store.js'
import { onRender } from './render.js'
import { Game } from './components.js'

const App = document.getElementById('app')

onRender(() => {
  const state = getState()
  console.log('re-render', state)
  if (state.error) {
    return App.innerHTML = state.error.message
  }
  if (state.waiting) {
    const url = `${location.origin}?play=${state.playId}`
    return App.innerHTML = `Waiting at <a href="${url}">${url}</a>`
  }
  state.players && (App.innerHTML = Game(state))
})