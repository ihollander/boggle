import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import MainBoard from '../board/MainBoard'
import WordList from '../board/WordList'
import ActionBar from '../board/ActionBar'

import * as gameSelectors from '../../store/game/selectors'
import * as gameActions from '../../store/game/actions'
import { gameStates } from '../../constants'
import { BoggleSolver } from '../../utils/words'
import Countdown from '../board/Countdown'
import useActionCable from '../../actioncable/useActionCable'

const BoardContainer = styled.section`
  padding: 2rem;
  height: 100vh;
  margin: 0 auto;
`


const Game = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { dice, selectedWord } = useSelector(gameSelectors.getBoard)
  const { words, score } = useSelector(gameSelectors.getWords)
  const gameState = useSelector(gameSelectors.getGameState)

  const gameId = useSelector(gameSelectors.getGameId)
  if (!gameId) history.push("/")

  const [showSolution, setShowSolution] = useState(false)
  const [solvedWords, setSolvedWords] = useState([])
  const [validatingState, setValidatingState] = useState(0)

  const solverRef = useRef(null)

  useActionCable({
    channel: "GamesChannel",
    id: gameId
  }, {
    connected: () => console.log("connected"),
    disconnected: () => console.log("disconnected"),
    received: () => console.log("received")
  })

  // create solver & calculate solutions
  useEffect(() => {
    if (dice.length && gameState === gameStates.PLAYING && !solverRef.current) {
      solverRef.current = new BoggleSolver(dice.map(die => die.face))
      // consider making this .thenable, solve may take a while
      setSolvedWords(solverRef.current.solve())
    }
  }, [dice, gameState])

  const submitWord = () => {
    if (solverRef.current.isValidWord(selectedWord) && !words.includes(selectedWord)) {
      setValidatingState(1)
      setTimeout(() => {
        setValidatingState(0)
        dispatch(gameActions.addWord(selectedWord))
      }, 300)
    } else {
      setValidatingState(2)
      setTimeout(() => {
        setValidatingState(0)
        dispatch(gameActions.clearSelected())
      }, 300)
    }
  }

  if (gameState === gameStates.PAUSED) {
    return <Countdown />
  }

  return (
    <BoardContainer>
      <MainBoard
        dice={dice}
        gameState={gameState}
        validatingState={validatingState}
        submitWord={submitWord}
      />
      <ActionBar
        ended={gameState === gameStates.ENDED}
        score={score}
        showSolution={showSolution}
        setShowSolution={setShowSolution}
      />
      <WordList
        showSolution={showSolution}
        words={words}
        solvedWords={solvedWords}
        selectedWord={selectedWord}
        validatingState={validatingState}
      />
    </BoardContainer>
  )
}

export default Game