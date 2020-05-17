import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import ReactGA from 'react-ga'

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
import BoggleSolver from '../../utils/BoggleSolver'
import Loader from '../shared/Loader'
import { getGame } from '../../api/games'

const BoardContainer = styled.section`
  height: calc(100vh - 4rem);
  margin: 0 auto;
  overscroll-behavior-y: none;
`

const isValidSelection = (selected, index) => {
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

const Game = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const history = useHistory()

  const { dice, selected, selectedWord } = useSelector(gameSelectors.getBoard)
  const { words, score } = useSelector(gameSelectors.getWords)
  const gameState = useSelector(gameSelectors.getGameState)
  const username = useSelector(userSelectors.getUser)
  const players = useSelector(gameSelectors.getPlayers)

  const [showSolution, setShowSolution] = useState(false)
  const [solvedWords, setSolvedWords] = useState([])
  const [validatingState, setValidatingState] = useState(0)

  const solverRef = useRef(null)

  if (!id) {
    ReactGA.exception({
      description: "Missing game id",
      fatal: true
    });
    history.push("/")
  }

  useActionCable({
    channel: "GamesChannel",
    id: id,
    name: username
  }, {
    disconnected: data => console.log("cable disconnected", data),
    rejected: data => console.log("cable rejected", data),
    received: action => {
      if (action.type) {
        dispatch(action)
      }
    }
  })

  // fetch game
  useEffect(() => {
    getGame(id).then(game => {
      dispatch(gameActions.loadedGame(game))
    })
  }, [id, dispatch])

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
    if (isValidSelection(selected, index)) {
      dispatch(gameActions.select(index))
    }
  }

  // UNKNOWN => still need to fetch
  if (gameState === gameStates.UNKNOWN) {
    return <Loader />
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
        currentSelected={selected}
        selectLetter={selectLetter}
        submitWord={submitWord}
      />
      <ActionBar
        ended={gameState === gameStates.ENDED}
        score={score}
        showSolution={showSolution}
        setShowSolution={setShowSolution}
        id={id}
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