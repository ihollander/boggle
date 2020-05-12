import React, { useRef } from 'react'
import styled from 'styled-components'

import Dice from './Dice'

import { gameStates } from '../../constants'

const BoardContainer = styled.div`
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

const MainBoard = ({ dice, gameState, validatingState, submitWord, selectLetter }) => {
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
      selectLetter(index)
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

  return (
    <BoardContainer
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
    </BoardContainer>
  )
}

export default MainBoard