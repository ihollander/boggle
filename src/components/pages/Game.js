import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Dice from '../board/Dice'
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

const MainBoard = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px solid var(--foreground);
  overscroll-behavior-y: none;
  touch-action: none;
  position: relative;
`

const Blurrer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(1px);
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


  // this is a crazy-ass workaround, work on something better lol
  // begin dice select logic
  const selectingRef = useRef(false)
  const lastElementTouchRef = useRef()

  const reffedDice = dice.map(die => {
    const ref = React.createRef()
    return { ...die, ref }
  })

  const handleSelectStart = index => {
    selectingRef.current = true
    handleSelect(index)
  }

  const handleSelect = index => {
    if (gameState === gameStates.PLAYING && selectingRef.current) {
      dispatch(gameActions.select(index))
    }
  }

  const handleSelectEnd = () => {
    selectingRef.current = false
    submitWord()
  }

  const handleTouchMove = ({ touches }) => {
    const el = document.elementFromPoint(touches[0].clientX, touches[0].clientY)
    if (el !== lastElementTouchRef.current) {
      const die = reffedDice.find(die => die.ref.current === el)
      if (die && !die.selected) {
        handleSelect(die.index)
      }
    }
    lastElementTouchRef.current = el
  }
  // end dice select logic

  if (gameState === gameStates.PAUSED) {
    return <Countdown />
  }

  return (
    <BoardContainer>
      <MainBoard
        onTouchEnd={handleSelectEnd}
        onMouseUp={handleSelectEnd}
        onTouchMove={handleTouchMove}
      >
        {reffedDice.map(({ index, face, selected, ref }) => {
          return <Dice
            key={index}
            ref={ref}
            index={index}
            validatingState={selected ? validatingState : 0}
            selected={selected}
            face={face}
            handleSelectStart={handleSelectStart}
            handleSelect={handleSelect}
          />
        })}
        {gameState === gameStates.ENDED && <Blurrer />}
      </MainBoard>
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