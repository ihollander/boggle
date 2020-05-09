import React from 'react'
import styled from 'styled-components'
import Timer from './Timer'

const ActionBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
`

const ActionBar = ({ score }) => {
  return (
    <ActionBarContainer>
      <h2>SCORE: {score}</h2>
      <Timer />
    </ActionBarContainer>
  )
}

export default ActionBar