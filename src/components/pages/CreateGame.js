import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Button from '../shared/Button'

import * as gameActions from '../../store/game/actions'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
`

const FormField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  position: relative;

  label {
    font-size: 1.5rem;
    font-weight: bold;
  }

  select {
    appearance: none;
    border-radius: 0;
  }

  select,
  input {
    border: 0.2rem solid black;
    background-color: white;
    width: 50%;
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0.25rem 1rem;
  }
`

const CreateGame = () => {
  const [gridSize, setGridSize] = useState("4")
  const [timer, setTimer] = useState("120")
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(gameActions.createGame({ timer: parseInt(timer), gridSize: parseInt(gridSize) }))
    history.push("/game")
  }

  return (

    <Form onSubmit={handleSubmit}>
      <FormField>
        <label>Grid Size:</label>
        <select value={gridSize} onChange={e => setGridSize(e.target.value)}>
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
        </select>
      </FormField>
      <FormField>
        <label>Time (s):</label>
        <input type="number" step={1} min={0} value={timer} onChange={e => setTimer(e.target.value)} />
      </FormField>
      <Button size="medium">CREATE</Button>
    </Form>
  )
}

export default CreateGame