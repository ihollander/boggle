import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import ReactGA from 'react-ga'

import Form from '../shared/Form'
import Button from '../shared/Button'

import * as userActions from '../../store/user/actions'

const SignIn = () => {
  const [username, setUsername] = useState("")
  const dispatch = useDispatch()

  const handleSubmit = e => {
    e.preventDefault()
    // pls
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      ReactGA.set({ dimension1: `${lat}:${lng}` });
      localStorage.setItem("username", username)
      dispatch(userActions.signIn({ username }))
    }

    function error(err) {
      alert("Please enable location tracking to allow all features!")
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
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