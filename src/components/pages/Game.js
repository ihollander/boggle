import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import MainBoard from '../board/MainBoard'
import WordList from '../board/WordList'
import ActionBar from '../board/ActionBar'

import * as userSelectors from '../../store/user/selectors'
import * as gameSelectors from '../../store/game/selectors'
import * as gameActions from '../../store/game/actions'
import { gameStates } from '../../constants'
import { BoggleSolver } from '../../utils/words'
import CountdownScreen from '../board/CountdownScreen'
import useActionCable from '../../actioncable/useActionCable'
import ReadyScreen from '../board/ReadyScreen'
import { submitWords } from '../../api/games'
import EndScreen from '../board/EndScreen'

const BoardContainer = styled.section`
  height: 100vh;
  margin: 0 auto;
  /* padding: 2rem; */
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
    connected: data => console.log("connected", data),
    disconnected: data => console.log("disconnected", data),
    received: action => {
      console.log("cable", action)
      if (action.type) {
        dispatch(action)
      }
    }
  })

  useEffect(() => {
    if (gameState === gameStates.ENDED) {
      // TODO: this should just be emitted to the channel
      submitWords(id, { username, words })
    }
  }, [gameState, id, username, words])

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
    return <EndScreen solvedWords={solvedWords} />
  }

  // PLAYING => 
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