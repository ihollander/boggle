import React from 'react'
import styled from 'styled-components'
import Timer from './Timer'

const ActionBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
`

const ActionBar = ({ id, score, ended, showSolution, setShowSolution }) => {
  return (
    <ActionBarContainer>
      <h2>SCORE: {score}</h2>
      {ended && (
        <h2 onClick={() => setShowSolution(!showSolution)} style={{ textDecoration: `${showSolution ? "none" : "underline"}` }}>
          ANSWERS
        </h2>
      )}
      <Timer id={id} />
    </ActionBarContainer>
  )
}

export default ActionBar