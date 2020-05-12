import { BoggleSolver } from '../../utils/words'

export const getTimer = ({ game: { timer } }) => timer

export const getGameState = ({ game: { gameState } }) => gameState

export const getGameType = ({ game: { gameType } }) => gameType

export const getGameId = ({ game: { id } }) => id

export const getPlayers = ({ game: { players } }) =>
  players.map(player => ({
    name: player.name,
    words: (player.words || []),
    score: BoggleSolver.getTotalPoints(player.words || [])
  }))

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
    score: BoggleSolver.getTotalPoints(words)
  }
}