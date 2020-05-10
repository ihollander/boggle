import React from 'react'
import styled, { css } from 'styled-components'

const DieHolder = styled.div`
  width: 25%;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`

// this should be imported from somewhere instead...
// const colorMap = {
//   0: "#aaa",
//   1: "green",
//   2: "red"
// }

const Die = styled.div`
  font-size: 2rem;
  font-weight: bold;
  width: 75%;
  height: 75%;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.1s;
  border-radius: 1rem;

  ${props => props.selected && css`
    background-color: cyan;
  `}
  ${props => props.tileState === 1 && css`
    background-color: green;
  `}
  ${props => props.tileState === 2 && css`
    background-color: red;
  `}
`

const Dice = React.forwardRef(({ selected, index, face, tileState, handleSelectStart, handleSelect }, ref) => {
  return (
    <DieHolder>
      <Die
        ref={ref}
        tileState={tileState}
        selected={selected}
        onTouchStart={() => handleSelectStart(index)}
        onMouseDown={() => handleSelectStart(index)}
        onMouseEnter={() => !selected && handleSelect(index)}
      >
        {face}
      </Die>
    </DieHolder>
  )
})

export default Dice