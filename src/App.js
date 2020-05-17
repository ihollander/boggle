import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Switch, Route } from 'react-router'
import ReactGA from 'react-ga'

import NavBar from './components/layout/NavBar'
import Loader from './components/shared/Loader'
import Board from './components/pages/Game'
import Home from './components/pages/Home'
import CreateGame from './components/pages/CreateGame'
import SignIn from './components/pages/SignIn'
import Join from './components/pages/Join'
import Scores from './components/pages/Scores'

import * as userSelectors from './store/user/selectors'
import * as userActions from './store/user/actions'

const Main = styled.main`
  display: flex;
  height: calc(100vh - 4rem);
  width: 100vw;
  justify-content: center;
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 500px;
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
  const [ready, setReady] = useState(false)

  // wake up heroku server
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
    fetch(process.env.REACT_APP_HTTP_ROOT)
      .then(() => setReady(true))
  }, [])

  useEffect(() => {
    const username = localStorage.getItem("username")
    if (username) {
      dispatch(userActions.signIn({ username }))
    }
  }, [dispatch, username])

  return (
    <>
      <NavBar />
      <Main>
        <Wrapper>
          {!ready ? <Loader /> : (
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
              <Route path="/scores">
                <Scores />
              </Route>
              <Route path="/signin">
                <SignIn />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          )}
        </Wrapper>
      </Main>
    </>
  );
}

export default App;
