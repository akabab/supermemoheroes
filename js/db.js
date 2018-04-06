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

dispatch({ type: 'update', state: { playId, playerId } })

export const init = (new Promise(async (s, f) => {
  const playRef = (await db).ref('play').child(playId)

  dispatch({
    type: 'db',
    db: {
      cards: playRef.child('cards'),
      actions: playRef.child('actions'),
    },
  })

  const play = (await playRef.once('value')).val()

  if (params.get('play')) {
    // On nous a demandé de join une game
    if (!play) return f(Error('game not found'))
    if (play.ended) return f(Error('game already over'))

    const player = (await playRef.child('players').child(1).once('value')).val()
    if (player !== null) return f(Error('not your game'))
    // Join game
    playRef.child('players').child(1).set(playerId)

    return s([ play.players[0], playerId ])
  }

  if (play) {
    console.log(play.players)
    if (!play.players) return f(Error('broken game state'))
    if (play.players[0] !== playerId) return f(Error('not your game'))
    if (play.ended) return f(Error('game already over'))
    if (play.players[1]) return s([ playerId, play.players[1] ])
  } else {
    // Init a new game
    playRef.child('players').child(0).set(playerId)
  }

  // Wait for the next player to join
  playRef.child('players').child(1).on('value', snapshot => snapshot.val() === null
    ? dispatch({ type: 'waiting-for-opponnent' })
    : s([ playerId, snapshot.val() ]))

  dispatch({ type: 'init-play' })
}))
  .then(players => dispatch({ type: 'players', players }))
  .catch(error => dispatch({ type: 'error', error }))
