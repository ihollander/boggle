import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import Form from '../shared/Form'
import Button from '../shared/Button'

const SignIn = () => {
  const [gameId, setGameId] = useState("")
  const history = useHistory()

  const handleSubmit = e => {
    e.preventDefault()
    history.push("/games/" + gameId)
  }

  return (

    <Form onSubmit={handleSubmit}>
      <label>Game:</label>
      <input type="text" value={gameId} onChange={e => setGameId(e.target.value)} />
      <Button size="medium">SIGN IN</Button>
    </Form>
  )
}

export default SignIn