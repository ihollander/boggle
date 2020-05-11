import React from 'react';
import styled from 'styled-components'
import Board from './components/pages/Game'
import { Switch, Route } from 'react-router';
import Home from './components/pages/Home';
import CreateGame from './components/pages/CreateGame';
import SignIn from './components/pages/SignIn';
import Multiplayer from './components/pages/Multiplayer';

const Main = styled.main`
  background-color: #333;
`

const Wrapper = styled.div`
  max-width: 60vh;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--background);
`

function App() {
  return (
    <Main>
      <Wrapper>
        <Switch>
          <Route path="/create">
            <CreateGame />
          </Route>
          <Route path="/multi">
            <Multiplayer />
          </Route>
          <Route path="/game">
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
