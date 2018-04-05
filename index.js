import { baseUrl } from './shared.js'

const getHeroes = () => fetch(`${baseUrl}/all.json`)
  .then(response => response.json())

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const createCardElement = card => `
  <div class='card' style='background-image: url(${card.hero.images.sm});'>
    ${card.hero.name}
  </div>
`
const createGrid = cards => `
  <div id='grid'>
    ${cards.map(createCardElement).join('')}
  </div>
`

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

const gameContainer = document.getElementById('game')

const newGame = async () => {
  const heroes = await getHeroes()

  const cards = newDeck(heroes)

  console.log(cards)

  const grid = createGrid(cards)

  gameContainer.innerHTML = grid
}

newGame()
