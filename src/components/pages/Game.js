import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import MainBoard from '../board/MainBoard'
import WordList from '../board/WordList'
import ActionBar from '../board/ActionBar'
import CountdownScreen from '../board/CountdownScreen'
import ReadyScreen from '../board/ReadyScreen'
import EndScreen from '../board/EndScreen'

import useActionCable from '../../actioncable/useActionCable'

import * as userSelectors from '../../store/user/selectors'
import * as gameSelectors from '../../store/game/selectors'
import * as gameActions from '../../store/game/actions'
import { gameStates } from '../../constants'
import { BoggleSolver } from '../../utils/words'

const BoardContainer = styled.section`
  height: calc(100vh - 4rem);
  margin: 0 auto;
  overscroll-behavior-y: none;
`

const Game = () => {
  const dispatch = useDispatch()
  const { id } = useParams()

  const { dice, selectedWord } = useSelector(gameSelectors.getBoard)
  const { words, score } = useSelector(gameSelectors.getWords)
  const gameState = useSelector(gameSelectors.getGameState)
  const username = useSelector(userSelectors.getUser)
  const players = useSelector(gameSelectors.getPlayers)

  const [showSolution, setShowSolution] = useState(false)
  const [solvedWords, setSolvedWords] = useState([])
  const [validatingState, setValidatingState] = useState(0)

  const solverRef = useRef(null)

  useActionCable({
    channel: "GamesChannel",
    id: id,
    name: username
  }, {
    received: action => {
      if (action.type) {
        dispatch(action)
      }
    }
  })

  // create solver & calculate solutions
  useEffect(() => {
    if (dice.length && (gameState === gameStates.PLAYING || gameState === gameStates.ENDED) && !solverRef.current) {
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

  const selectLetter = index => {
    dispatch(gameActions.select(index))
  }

  // WAITING => show button/players
  if (gameState === gameStates.WAITING) {
    return <ReadyScreen players={players} id={id} />
  }

  // STARTING => show countdown
  if (gameState === gameStates.STARTING) {
    return <CountdownScreen />
  }

  // ENDED => show scores/words
  if (gameState === gameStates.ENDED) {
    // get scores from everyone somehow
    return <EndScreen solvedWords={solvedWords} players={players} username={username} />
  }

  // PLAYING => 
  return (
    <BoardContainer>
      <MainBoard
        dice={dice}
        gameState={gameState}
        validatingState={validatingState}
        selectLetter={selectLetter}
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