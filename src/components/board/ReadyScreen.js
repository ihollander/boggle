import React from 'react'
import styled from 'styled-components'
import Button from '../shared/Button'
import { startGame } from '../../api/games'

const PlayerHeader = styled.h1`
  margin: 2rem 0 1rem;
`

const PlayerList = styled.ul`
  list-style: none;
  text-align: center;
`

const Player = styled.li`
  font-size: 1.25rem;
  font-weight: bold;
`

const ReadyScreen = ({ id, players }) => {

  const handleReadyClick = () => {
    startGame(id)
  }

  return (
    <>
      <Button onClick={handleReadyClick}>
        Ready?
      </Button>
      <PlayerHeader>Players:</PlayerHeader>
      <PlayerList>
        {players.map(player => (
          <Player key={player.name}>{player.name}</Player>
        ))}
      </PlayerList>
    </>
  )
}

export default ReadyScreen