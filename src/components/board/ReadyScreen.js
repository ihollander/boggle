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
  margin-bottom: 4rem;
`

const Player = styled.li`
  font-size: 1.25rem;
  font-weight: bold;
`

const ReadyScreen = ({ id, players }) => {

  const handleReadyClick = () => {
    startGame(id)
  }

  const handleCopyClick = () => {
    const url = window.location.origin + "/games/" + id
    navigator.clipboard.writeText(url)
  }

  return (
    <>
      <Button onClick={handleReadyClick}>
        Start
      </Button>
      <PlayerHeader>Players:</PlayerHeader>
      <PlayerList>
        {players.map(player => (
          <Player key={player.name}>{player.name}</Player>
        ))}
      </PlayerList>
      <Button size="small" onClick={handleCopyClick}>
        Copy Invite
      </Button>
    </>
  )
}

export default ReadyScreen