import React from 'react'
import { Link } from 'react-router-dom'

import Button from '../shared/Button'

const Home = () => {
  return (
    <>
      <Link to="/create">
        <Button>New</Button>
      </Link>
      <Link to="/join">
        <Button>Join</Button>
      </Link>
    </>
  )
}

export default Home