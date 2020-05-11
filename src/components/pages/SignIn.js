import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Form from '../shared/Form'
import Button from '../shared/Button'

import * as userActions from '../../store/user/actions'

const SignIn = () => {
  const [username, setUsername] = useState("")
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = e => {
    e.preventDefault()
    localStorage.setItem("username", username)
    dispatch(userActions.signIn({ username }))
    history.push("/multi")
  }

  return (

    <Form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      <Button size="medium">SIGN IN</Button>
    </Form>
  )
}

export default SignIn