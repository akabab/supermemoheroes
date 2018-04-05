const Card = card => `
  <div class='card' style='background-image: url(${card.hero.images.sm});'>
    ${card.hero.name}
  </div>
`

const Grid = cards => `
  <div id='grid'>
    ${cards.map(Card).join('')}
  </div>
`

const Lifebar = life => `
  <div class='lifebar'>${life}</div>
`

const PlayerHUD = player => `
  <div class='player-hud'>
    ${Lifebar(player.life)}
  </div>
`

const Header = players => `
  <div id='header'>
    <div class='player-hud' style='justify-content: flex-start;'>${Lifebar(100)}</div>
    <div class='player-hud' style='justify-content: flex-end;'>${Lifebar(100)}</div>
  </div>
`

const Board = game => `
  <div id='board'>
    ${Grid(game.cards)}
  </div>
`

export const Game = game => `
  <div id='game'>
    ${Header(game.players)}
    ${Board(game)}
  </div>
`
