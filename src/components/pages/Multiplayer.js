import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../shared/Button'

const Multiplayer = () => {

  return (
    <>
      <Link to="/join">
        <Button>
          JOIN
        </Button>
      </Link>
      <Link to="/create">
        <Button>
          CREATE
        </Button>
      </Link>
    </>
  )
}

export default Multiplayer