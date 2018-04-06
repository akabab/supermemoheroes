const style = card => card.flipped
  ? `background-image: url(${card.hero.images.sm});`
  : `background-color: hotpink;`

const Card = (card, i) => `
  <div class='card' data-id=${i} style='${style(card)}'>
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
    ${ '' /*player.powers.map(Card).join('')*/ }
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
