import { TICK, ADD } from '../constants'

const next = (state = { lastUpdate: 0, light: false, count: 0 }, action) => {
  switch (action.type) {
    case TICK:
      return { ...state, lastUpdate: action.ts, light: !!action.light }
    case ADD:
      return { ...state, count: state.count + 1 }
    default:
      return state
  }
}

export default next
