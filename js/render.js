const actions = []
let queued = false
const render = state => {
  queued = false
  for (const action of actions) {
    action(state)
  }
}

requestAnimationFrame(render)

export const request = () => queued || (queued = requestAnimationFrame(render))
export const onRender = fn => {
  actions.push(fn)
  return () => actions.includes(fn) && actions.splice(actions.indexOf(fn), 1)
}
