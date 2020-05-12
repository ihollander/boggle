import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useInterval } from '../../hooks/useInterval'
import * as userSelectors from '../../store/user/selectors'
import * as gameSelectors from '../../store/game/selectors'
import * as gameActions from '../../store/game/actions'
import { gameStates } from '../../constants'
import { endGame, submitWords } from '../../api/games'
import BoggleSolver from '../../utils/BoggleSolver'

const formatTime = time => {
  const m = Math.floor(time / 60)
  const ss = `${time % 60}`.padStart(2, "0")
  return `${m}:${ss}`
}

const Timer = () => {

  const dispatch = useDispatch()

  const timer = useSelector(gameSelectors.getTimer)
  const gameState = useSelector(gameSelectors.getGameState)
  const id = useSelector(gameSelectors.getGameId)
  const username = useSelector(userSelectors.getUser)
  const { words } = useSelector(gameSelectors.getWords)

  useInterval(() => {
    if (timer <= 1) {
      const score = BoggleSolver.getTotalPoints(words)
      endGame(id)
      submitWords(id, { username, words, score })
    } else {
      dispatch(gameActions.timerTick())
    }
  }, gameState === gameStates.PLAYING ? 1000 : null)

  return (
    <h2>{formatTime(timer)}</h2>
  )
}

export default Timer