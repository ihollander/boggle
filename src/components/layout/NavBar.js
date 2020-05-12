import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Nav = styled.nav`
  background-color: var(--foreground);
  height: 4rem; 
  display: flex;
  justify-content: space-between;
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
      <Link to="/scores">
        High Scores
      </Link>
    </Nav>
  )
}

export default NavBar