import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import Button from '../shared/Button'

import * as gameActions from '../../store/game/actions'
import { useInterval } from '../../hooks/useInterval'

const Countdown = () => {
  const dispatch = useDispatch()
  const [counting, setCounting] = useState(false)
  const [countdownState, setCountdownState] = useState(-1)

  useInterval(() => {
    if (countdownState === 0) {
      dispatch(gameActions.startGame())
    } else {
      setCountdownState(countdownState - 1)
    }
  }, counting ? 1000 : null)

  const handleReadyClick = () => {
    setCountdownState(3)
    setCounting(true)
  }

  if (countdownState < 0) {
    return (
      <Button onClick={handleReadyClick}>
        {countdownState < 0 ? "READY?" : countdownState}
      </Button>
    )
  } else {
    return (
      <h1 style={{ fontSize: "4rem" }}>{countdownState === 0 ? "GO!" : `${countdownState}...`}</h1>
    )
  }
}

export default Countdown