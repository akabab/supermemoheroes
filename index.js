import { baseUrl } from './shared.js'
import { Game } from './components.js'

const getHeroes = () => fetch(`${baseUrl}/all.json`)
  .then(response => response.json())

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

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

const newDeck = (heroes, size = 6 * 5 / 2) => {
  heroes = shuffle([...heroes]).filter((hero, i) => i < size)

  const cards = shuffle(heroes.concat(heroes)
    .map((h, i) => ({ id: i, hero: h })))

  return cards
}

const App = document.getElementById('app')

const newGame = async () => {
  const heroes = (await getHeroes())
    .filter(hero => hero.images.xs.split('/xs/')[1] !== 'no-portrait.jpg')

  const cards = newDeck(heroes)

  const game = {
    cards,
    players: [
      { life: 100, cards: cards.filter((c, i) => i < 5) },
      { life: 100, cards: cards.filter((c, i) => i < 5) },
    ]
  }

  App.innerHTML = Game(game)
}

newGame()
