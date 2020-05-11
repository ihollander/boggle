import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import * as gameSelectors from '../../store/game/selectors'
import * as userSelectors from '../../store/user/selectors'
import { BoggleSolver } from '../../utils/words'

const PageContainer = styled.div`
  height: 100%;
  width: 100%;
  /* padding: 2rem; */
  
  h4 {
    display: inline-block;
    margin: 0.5rem 1rem;
  }
`

const ListContainer = styled.ul`
  list-style: none;
  height: 80vh;
  border: 4px solid var(--foreground);
  overflow-y: scroll;
  padding: 0.5rem;
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

const EndScreen = ({ solvedWords }) => {
  const players = useSelector(gameSelectors.getPlayers)
  const user = useSelector(userSelectors.getUser)

  const answerList = [{
    name: "Answers",
    words: solvedWords,
    score: 0
  }, ...players]

  console.log(answerList)

  const [selected, setSelected] = useState(user)

  const activeList = answerList.find(player => player.name === selected)

  return (
    <PageContainer>
      {players.length && answerList.map(player => (
        <h4 key={player.name} onClick={() => setSelected(player.name)} style={{ textDecoration: `${activeList.name === player.name ? "underline" : "none"}` }}>
          {player.name}
        </h4>
      ))}
      <ListContainer>
        {activeList.words.map(word => (
          <Word key={word}>
            <span style={{ color: `${activeList.name !== "Answers" && solvedWords.includes(word) ? "green" : "var(--foreground)"}` }}>{word}</span>
            <span className="score">+{BoggleSolver.getPoints(word)}</span>
          </Word>
        ))}
      </ListContainer>
    </PageContainer>
  )
}

export default EndScreen