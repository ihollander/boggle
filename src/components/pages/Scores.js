import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { highScores } from '../../api/games'

const ScoreList = styled.ul`
  list-style: none;
  height: 100%;
  width: 100%;
  border: 4px solid var(--foreground);
  overflow-y: scroll;
  padding: 0.5rem;
`

const Score = styled.li`
  padding: 0.5rem 0;
  border-bottom: 2px solid var(--shadow);
  font-weight: bold;
  font-size: 1.25rem;
  display: flex;
  justify-content: space-between;

  &:last-child {
    border-bottom: none
  }
`

const Scores = () => {
  const [scores, setScores] = useState([])

  useEffect(() => {
    highScores().then(setScores)
  }, [])

  return (

    <ScoreList>
      {scores.map(({ id, name, score }) => (
        <Score key={id}>
          <span>{name}</span>
          <span>{score}</span>
        </Score>
      ))}
    </ScoreList>
  )
}

export default Scores