import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import Dice from '../board/Dice'
import WordList from '../board/WordList'
import ActionBar from '../board/ActionBar'
import Button from '../shared/Button'

import * as gameSelectors from '../../store/game/selectors'
import * as gameActions from '../../store/game/actions'
import { gameStates } from '../../constants'
import { BoggleSolver } from '../../utils/words'

const BoardContainer = styled.section`
  padding: 2rem;
  height: 100vh;
  margin: 0 auto;
`

const MainBoard = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px solid black;
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
  const dispatch = useDispatch()
  const { dice, selectedWord } = useSelector(gameSelectors.getBoard)
  const { words, score } = useSelector(gameSelectors.getWords)
  const gameState = useSelector(gameSelectors.getGameState)

  const [showSolution, setShowSolution] = useState(false)
  const [solvedWords, setSolvedWords] = useState([])
  const [tileState, setTileState] = useState(0)
  const [counterState, setCounterState] = useState(-1)

  const selectingRef = useRef(false)
  const lastElementTouchRef = useRef()
  const solverRef = useRef(null)

  useEffect(() => {
    if (dice.length && gameState === gameStates.PLAYING && !solverRef.current) {
      solverRef.current = new BoggleSolver(dice.map(die => die.face))
      setSolvedWords(solverRef.current.solve())
    }
  }, [dice, gameState])

  const submitWord = () => {
    if (solverRef.current.isValidWord(selectedWord) && !words.includes(selectedWord)) {
      setTileState(1)
      setTimeout(() => {
        setTileState(0)
        dispatch(gameActions.addWord(selectedWord))
      }, 300)
      // also show the player some message?
      // maybe a separate reducer for displaying messages, has a message text + message type, handles same action as board reducer
    } else {
      setTileState(2)
      setTimeout(() => {
        setTileState(0)
        dispatch(gameActions.clearSelected())
      }, 300)
    }
  }

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
    // setTimeout(() => {
    selectingRef.current = false
    submitWord()
    // }, 250)
  }

  // this is a crazy-ass workaround, work on something better lol
  const reffedDice = dice.map(die => {
    const ref = React.createRef()
    return { ...die, ref }
  })

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

  const handleReadyClick = () => {
    let counter = 3
    setCounterState(counter)

    const interval = setInterval(() => {
      if (counter === 0) {
        dispatch(gameActions.startGame())
        clearInterval(interval)
      }
      counter--
      setCounterState(counter)
    }, 1000)
  }

  if (gameState === gameStates.PAUSED) {
    if (counterState < 0) {
      return (
        <Button onClick={handleReadyClick}>
          {counterState < 0 ? "READY?" : counterState}
        </Button>
      )
    } else {
      return (
        <h1 style={{ fontSize: "4rem" }}>{counterState === 0 ? "GO!" : `${counterState}...`}</h1>
      )
    }
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
            tileState={selected ? tileState : 0}
            selected={selected}
            face={face}
            handleSelectStart={handleSelectStart}
            handleSelect={handleSelect}
          />
        })}
        {gameState === gameStates.ENDED && <Blurrer />}
      </MainBoard>
      <ActionBar ended={gameState === gameStates.ENDED} score={score} showSolution={showSolution} setShowSolution={setShowSolution} />
      <WordList showSolution={showSolution} words={words} solvedWords={solvedWords} selectedWord={selectedWord} tileState={tileState} />
    </BoardContainer>
  )
}

export default Game