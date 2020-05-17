import * as types from './types'

// dice packs -> moved to server
// const fourByFourDice = ["AAEEGN", "ELRTTY", "AOOTTW", "ABBJOO", "EHRTVW", "CIMOTU", "DISTTY", "EIOSST", "DELRVY", "ACHOPS", "HIMNQU", "EEINSU", "EEGHNW", "AFFKPS", "HLNNRZ", "DEILRX"]

// const roll = () => Math.floor(Math.random() * 6)
// const shuffle = array => array.sort(() => Math.random() < 0.5 ? -1 : 1)

// const shuffled = shuffle([...fourByFourDice])
// const letters = shuffled.map(die => die[roll()])

// send to API & let actioncable response kick things off instead?
// what about single player games
// maybe leave this for single player games & have another flow for multiplayer

export const setGameType = type => ({ type: types.SET_TYPE, payload: type })

export const createGame = ({ gridSize, timer, id, status, players, letters }) => ({
  type: types.CREATE,
  payload: { gridSize, timer, id, status, players, letters }
})

export const loadedGame = game => ({ type: types.LOADED, payload: game })

export const startGame = () => ({ type: types.START })

export const startingGame = () => ({ type: types.STARTING })

export const endGame = () => ({ type: types.END })

export const select = index => ({ type: types.TOGGLE_SELECTED, payload: index })

export const setSelected = letters => ({ type: types.SET_SELECTED, payload: letters })

export const addWord = word => ({ type: types.ADD_WORD, payload: word })

export const clearSelected = () => ({ type: types.CLEAR_SELECTED })

export const timerTick = () => ({ type: types.TIMER_TICK })