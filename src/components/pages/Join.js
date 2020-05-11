import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getGames } from '../../api/games'
import { Link } from 'react-router-dom'

const GameList = styled.ul`
  list-style: none;
  height: 100%;
  width: 100%;
  border: 4px solid var(--foreground);
  overflow-y: scroll;
  padding: 0.5rem;
`

const Game = styled.li`
  padding: 0.5rem 0;
  border-bottom: 2px solid var(--shadow);
  font-weight: bold;

  a {
    font-size: 1.25rem;
    display: flex;
    justify-content: space-between;
  }

  &:last-child {
    border-bottom: none
  }
`

const Join = () => {
  const [games, setGames] = useState([])

  useEffect(() => {
    getGames().then(setGames)
  }, [])

  console.log(games)

  return (

    <GameList>
      {games.length === 0 && (
        <Link to="/create">
          No Active Games - Make One
        </Link>
      )}
      {games.map(game => (
        <Game key={game.name}>
          <Link to={`/games/${game.name}`}>
            <span>{game.name}</span>
            <span>{game.players[0]?.name}</span>
          </Link>
        </Game>
      ))}
    </GameList>
  )
}

export default Join