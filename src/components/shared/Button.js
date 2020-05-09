import React from 'react'
import styled from 'styled-components'

const sizes = {
  small: "2rem",
  medium: "3rem",
  large: "4rem",
}

const Button = styled.button`
  font-size: ${props => props.size ? sizes[props.size] : "4rem"};
  border: 0.2rem solid black;
  background-color: white;
  padding: 1rem;
  margin: 2rem;

  div {
    background-color: #ddd;
    padding: 1.25rem 2.25rem;
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