import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Button from '../shared/Button'

import * as userActions from '../../store/user/actions'
import * as gameActions from '../../store/game/actions'

import { gameTypes } from '../../constants'

const Home = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleMultiPlayer = () => {
    const username = localStorage.getItem("username")
    if (username) {
      dispatch(userActions.signIn({ username }))
      dispatch(gameActions.setGameType(gameTypes.MULTI))
      history.push("/multi")
    } else {
      history.push("/signin")
    }
  }

  const handleSinglePlayer = () => {
    dispatch(gameActions.setGameType(gameTypes.SINGLE))
    history.push("/create")
  }

  return (
    <>
      <Button onClick={handleSinglePlayer}>
        1 PLAYER
      </Button>
      <Button onClick={handleMultiPlayer}>
        2+ PLAYERS
      </Button>
    </>
  )
}

export default Home