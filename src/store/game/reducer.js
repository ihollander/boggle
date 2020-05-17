import * as types from './types'
import { gameStates } from '../../constants'

const defaultState = {
  id: null,
  letters: ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
  selected: [],
  words: [],
  gameState: gameStates.UNKNOWN,
  timer: 0,
  players: []
}

const reducerActions = {
  [types.CREATE](state, action) {
    return {
      ...state,
      gameState: gameStates.WAITING,
      timer: action.payload.timer,
      id: action.payload.name,
      players: action.payload.players,
      letters: action.payload.letters
    }
  },
  [types.LOADED](state, action) {
    return {
      ...state,
      timer: action.payload.timer,
      id: action.payload.name,
      players: action.payload.players,
      gameState: gameStates.WAITING,
      letters: action.payload.dice.split("")
    }
  },
  [types.JOINED](state, action) {
    return {
      ...state,
      players: action.payload
    }
  },
  [types.LEFT](state, action) {
    return {
      ...state,
      players: action.payload
    }
  },
  [types.STARTING](state) {
    return {
      ...state,
      gameState: gameStates.STARTING,
    }
  },
  [types.START](state) {
    return {
      ...state,
      gameState: gameStates.PLAYING,
      words: [],
      selected: [],
      timer: state.timer > 0 ? state.timer : 10, // testing
    }
  },
  [types.END](state) {
    return {
      ...state,
      gameState: gameStates.ENDED,
      timer: 0
    }
  },
  [types.TOGGLE_SELECTED](state, action) {
    return {
      ...state,
      selected: [...state.selected, action.payload]
    }
  },
  [types.SET_SELECTED](state, action) {
    return {
      ...state,
      selected: action.payload
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
  },
  [types.WORDS_RECEIVED](state, action) {
    return {
      ...state,
      players: state.players.map(player => player.name === action.payload.username ? { ...player, words: action.payload.words } : player)
    }
  }
}

const reducer = (state = defaultState, action) => {
  return reducerActions[action.type] ? reducerActions[action.type](state, action) : state
}

export default reducer