import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import * as gameActions from '../../store/game/actions'
import { useInterval } from '../../hooks/useInterval'

const CountdownScreen = () => {
  const dispatch = useDispatch()
  const [counting, setCounting] = useState(false)
  const [countdownState, setCountdownState] = useState(-1)

  useEffect(() => {
    setCountdownState(3)
    setCounting(true)
  }, [])

  useInterval(() => {
    if (countdownState === 0) {
      dispatch(gameActions.startGame())
    } else {
      setCountdownState(countdownState - 1)
    }
  }, counting ? 1000 : null)

  return (
    <h1 style={{ fontSize: "4rem" }}>{countdownState === 0 ? "GO!" : `${countdownState}...`}</h1>
  )
}

export default CountdownScreen