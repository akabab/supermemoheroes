import { dispatch } from './store.js'

firebase.initializeApp({
  apiKey: "AIzaSyB2sYVwbLID5J8rwme6_BHBpf-aBkFbpnA",
  authDomain: "supermemoheroes.firebaseapp.com",
  databaseURL: "https://supermemoheroes.firebaseio.com",
  projectId: "supermemoheroes",
  storageBucket: "supermemoheroes.appspot.com",
  messagingSenderId: "719862474384"
})

const getRandId = () => Number(String(Math.random()).slice(2)).toString(36)

const params = new URLSearchParams(location.search)
export const db = firebase.database()
const playerId = localStorage.playerId || (localStorage.playerId = getRandId())
const playId = localStorage.playId = params.get('play')
  || localStorage.playId
  || getRandId()

dispatch({ type: 'update-state', state: { playId, playerId } })

export const init = (new Promise(async (s, f) => {
  const playRef = (await db).ref('play').child(playId)

  playRef.child('state').on('value', snapshot =>
    dispatch({ type: 'play', state: snapshot.val() }))

  const play = (await playRef.once('value')).val()

  if (params.get('play')) {
    // On nous a demandé de join une game
    if (!play) return f(Error('game not found'))
    if (play.ended) return f(Error('game already over'))

    // Join game
    playRef.child('playerB').set(playerId)

    return s([ play.playerA, playerId ])
  }

  if (play) {
    if (play.playerA !== playerId) return f(Error('Not your game'))
    if (play.ended) return f(Error('game already over'))
    if (play.playerB) return s([ playerId, play.playerB ])
  } else {
    // Init a new game
    playRef.child('playerA').set(playerId)
  }

  // Wait for the next player to join
  playRef.child('playerB').on('value', snapshot => snapshot.val() === null
    ? dispatch({ type: 'waiting-for-opponnent' })
    : s([ playerId, snapshot.val() ]))

  dispatch({ type: 'update-state', state: { playRef } })
}))
  .then(players => dispatch({ type: 'players', players }))
  .catch(error => dispatch({ type: 'error', error }))
