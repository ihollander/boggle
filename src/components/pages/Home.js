import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../shared/Button'

const Home = () => {

  // const handleMuliplayer = () => {
  //   // set the game type etc
  //   // push history to next page
  // }

  return (
    <>
      <Link to="/create">
        <Button>
          1 PLAYER
        </Button>
      </Link>
      <Link to="/multi">
        <Button>
          2+ PLAYERS
        </Button>
      </Link>
    </>
  )
}

export default Home