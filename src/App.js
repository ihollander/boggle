import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Board from './components/pages/Game'
import { Switch, Route } from 'react-router'
import Home from './components/pages/Home'
import CreateGame from './components/pages/CreateGame'
import SignIn from './components/pages/SignIn'

import * as userSelectors from './store/user/selectors'
import * as userActions from './store/user/actions'
import Join from './components/pages/Join'
import NavBar from './components/layout/NavBar'

const Main = styled.main`
  background-color: #333;
`

const Wrapper = styled.div`
  max-width: 60vh;
  margin: 0 auto;
  height: 94vh;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--background);
  padding: 2rem;
`

function App() {
  const dispatch = useDispatch()
  const username = useSelector(userSelectors.getUser)

  // wake up heroku server
  useEffect(() => {
    fetch(process.env.REACT_APP_HTTP_ROOT)
  }, [])

  useEffect(() => {
    const username = localStorage.getItem("username")
    if (username) {
      dispatch(userActions.signIn({ username }))
    }
  }, [dispatch, username])

  return (
    <Main>
      <NavBar />
      <Wrapper>
        <Switch>
          <Route path="/create">
            {username ? <CreateGame /> : <SignIn />}
          </Route>
          <Route path="/join">
            {username ? <Join /> : <SignIn />}
          </Route>
          <Route path="/games/:id">
            <Board />
          </Route>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Wrapper>
    </Main>
  );
}

export default App;
