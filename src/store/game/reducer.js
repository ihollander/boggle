import * as types from './types'
import { gameStates, gameTypes } from '../../constants'

const defaultState = {
  letters: ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
  selected: [],
  words: [],
  gameState: gameStates.PAUSED,
  gameType: gameTypes.SINGLE,
  timer: 0
}

const isValidSelection = ({ selected }, index) => {
  if (selected.length === 0) return true

  const lastSelection = selected[selected.length - 1]

  const x = lastSelection % 4
  const y = Math.floor(lastSelection / 4)
  let neighbors = []
  for (let nx = Math.max(0, x - 1); nx < Math.min(x + 2, 4); nx++) {
    for (let ny = Math.max(0, y - 1); ny < Math.min(y + 2, 4); ny++) {
      if (!(nx === x && ny === y)) {
        neighbors.push((ny * 4) + nx)
      }
    }
  }

  return neighbors.includes(index)
}

const reducerActions = {
  [types.CREATE_GAME](_, action) {
    return {
      ...defaultState,
      gameState: gameStates.PAUSED,
      timer: action.payload.timer
    }
  },
  [types.START_GAME](state, action) {
    return {
      ...state,
      gameState: gameStates.PLAYING,
      timer: state.timer > 0 ? state.timer : 10, // testing
      letters: action.payload
    }
  },
  [types.END_GAME](state) {
    return {
      ...state,
      gameState: gameStates.ENDED,
      timer: 0
    }
  },
  [types.TOGGLE_SELECTED](state, action) {
    const isValid = isValidSelection(state, action.payload)
    if (isValid) {
      return {
        ...state,
        selected: [...state.selected, action.payload]
      }
    } else {
      return state
    }
  },
  [types.ADD_WORD](state, action) {
    return {
      ...state,
      selected: [],
      words: [action.payload, ...state.words]
    }
  },
  [types.CLEAR_SELECTED](state) {
    return {
      ...state,
      selected: []
    }
  },
  [types.TIMER_TICK](state) {
    return {
      ...state,
      timer: state.timer - 1
    }
  }
}

const reducer = (state = defaultState, action) => {
  // console.log(action)
  return reducerActions[action.type] ? reducerActions[action.type](state, action) : state
}

export default reducer