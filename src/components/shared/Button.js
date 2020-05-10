import React from 'react'
import styled from 'styled-components'

const sizes = {
  small: "1.5rem",
  medium: "2rem",
  large: "3rem",
}

const Button = styled.button`
  font-size: ${props => props.size ? sizes[props.size] : "3rem"};
  border: 4px solid black;
  background-color: white;
  padding: 1rem;
  margin: 2rem;

  div {
    background-color: #ddd;
    padding: 1rem 2rem;
    border-radius: 1rem;
    transition: background-color 0.1s;
  }

  &:focus {
    outline: none;
  }

  &:focus div,
  &:active div {
    background-color: cyan;
  }
`

export default ({ size, children, ...props }) => (
  <Button size={size} {...props}>
    <div>{children}</div>
  </Button>
)