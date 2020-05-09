import * as types from './types'

// dice packs
const fourByFourDice = ["AAEEGN", "ELRTTY", "AOOTTW", "ABBJOO", "EHRTVW", "CIMOTU", "DISTTY", "EIOSST", "DELRVY", "ACHOPS", "HIMNQU", "EEINSU", "EEGHNW", "AFFKPS", "HLNNRZ", "DEILRX"]

const roll = () => Math.floor(Math.random() * 6)
const shuffle = array => array.sort(() => Math.random() < 0.5 ? -1 : 1)

export const createGame = ({ gridSize, timer }) => ({ type: types.CREATE_GAME, payload: { gridSize, timer } })

export const startGame = () => {
  const shuffled = shuffle([...fourByFourDice])
  const letters = shuffled.map(die => die[roll()])

  return { type: types.START_GAME, payload: letters }
}

export const endGame = () => ({ type: types.END_GAME })

export const select = index => ({ type: types.TOGGLE_SELECTED, payload: index })

export const addWord = word => ({ type: types.ADD_WORD, payload: word })

export const clearSelected = () => ({ type: types.CLEAR_SELECTED })

export const timerTick = () => ({ type: types.TIMER_TICK })