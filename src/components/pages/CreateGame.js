import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Form from '../shared/Form'
import Button from '../shared/Button'

import { createGame } from '../../api/games'
import * as gameActions from '../../store/game/actions'
import * as userSelectors from '../../store/user/selectors'

const CreateGame = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const username = useSelector(userSelectors.getUser)

  const [gridSize, setGridSize] = useState("4")
  const [timer, setTimer] = useState("120")

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { name, status, players, dice } = await createGame({ username, gridSize, timer })
      const letters = dice.split("")
      dispatch(gameActions.createGame({ timer: parseInt(timer), gridSize: parseInt(gridSize), id: name, status, players, letters }))
      history.push("/games/" + name)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <label>Grid Size:</label>
        <select value={gridSize} onChange={e => setGridSize(e.target.value)}>
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
        </select>
        <label>Time (seconds):</label>
        <input type="number" step={1} min={0} value={timer} onChange={e => setTimer(e.target.value)} />
        <Button size="medium">CREATE</Button>
      </Form>
    </>
  )
}

export default CreateGame