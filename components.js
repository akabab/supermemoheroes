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

const Sidebar = player => `
  <div class='sidebar'>
    ${player.cards.map(Card).join('')}
  </div>
`

const Board = game => `
  <div id='board'>
    ${Sidebar(game.players[0])}
    ${Grid(game.cards)}
    ${Sidebar(game.players[1])}
  </div>
`

export const Game = game => `
  <div id='game'>
    ${Header(game.players)}
    ${Board(game)}
  </div>
`
