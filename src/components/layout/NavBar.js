import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Nav = styled.nav`
  height: 6vh;
  padding: 0.25rem 1rem;
  width: 100%;
  background-color: var(--foreground);
  display: flex;
  align-items: center;

  a {
    color: var(--background);
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0 1rem;
  }
`

const NavBar = () => {
  return (
    <Nav>
      <Link to="/">
        Home
      </Link>
      <Link to="/join">
        Lobby
      </Link>
    </Nav>
  )
}

export default NavBar