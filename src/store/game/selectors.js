import { BoggleSolver } from '../../utils/words'

export const getTimer = ({ game: { timer } }) => timer

export const getGameState = ({ game: { gameState } }) => gameState

export const getGameType = ({ game: { gameType } }) => gameType

export const getGameId = ({ game: { id } }) => id

export const getBoard = ({ game: { letters, selected } }) => {
  const mappedDice = letters.map((letter, index) => {
    return {
      index,
      face: letter === "Q" ? "Qu" : letter,
      selected: selected.includes(index)
    }
  })

  return {
    dice: mappedDice,
    selectedWord: selected.map(index => mappedDice[index].face).join("").toUpperCase()
  }
}

export const getWords = ({ game: { words } }) => {
  return {
    words,
    score: words.reduce((sum, word) => {
      return sum + BoggleSolver.getPoints(word)
    }, 0)
  }
}