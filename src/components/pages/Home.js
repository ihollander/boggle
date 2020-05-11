import React from 'react'
import { Link } from 'react-router-dom'

import Button from '../shared/Button'

const Home = () => {
  return (
    <>
      <Link to="/join">
        <Button>
          bogle
        </Button>
      </Link>
      {/* <Link to="/create">
        <Button>
          CREATE
        </Button>
      </Link> */}
    </>
  )
}

export default Home