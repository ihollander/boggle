import React, { useState } from 'react'
import styled from 'styled-components'

import BoggleSolver from '../../utils/BoggleSolver'

const PageContainer = styled.div`
  height: 100%;
  width: 100%;
`

const PlayerList = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  
  h2 {
    display: block;
    border-bottom: 1px solid transparent;
    transition: all 0.2s;

    &.active {
      border-bottom: 1px solid var(--foreground);
    }
  }
`

const ListContainer = styled.ul`
  list-style: none;
  height: 60vh;
  border: 4px solid var(--foreground);
  overflow-y: scroll;
  padding: 0.5rem;
`

const Score = styled.h3`
  margin: 0.25rem 0;
`

const Word = styled.li`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;

  .score {
    opacity: 0.7;
  }
`

const EndScreen = ({ solvedWords, players, username }) => {

  const answerList = [{
    name: "Answers",
    words: solvedWords,
    score: BoggleSolver.getTotalPoints(solvedWords)
  }, ...players]

  const [selected, setSelected] = useState(username)

  const activeList = answerList.find(player => player.name === selected)

  const playerWords = (answerList.find(player => player.name === username)?.words || [])

  return (
    <PageContainer>
      <PlayerList>
        {players.length && answerList.map(player => (
          <h2 key={player.name} onClick={() => setSelected(player.name)} className={`${activeList.name === player.name ? "active" : ""}`}>
            {player.name}
          </h2>
        ))}
      </PlayerList>
      {players.length && <Score>Score: {activeList.score}</Score>}
      <ListContainer>
        {activeList && activeList.words.map(word => (
          <Word key={word}>
            <span style={{ color: `${activeList.name === "Answers" && playerWords.includes(word) ? "green" : "var(--foreground)"}` }}>{word}</span>
            <span className="score">+{BoggleSolver.getPoints(word)}</span>
          </Word>
        ))}
      </ListContainer>
    </PageContainer>
  )
}

export default EndScreen