import styled from 'styled-components'

const sizes = {
  small: "1.5rem",
  medium: "2rem",
  large: "3rem",
}

const Button = styled.button`
  font-size: ${props => props.size ? sizes[props.size] : "3rem"};
  color: var(--foreground);
  border: 4px solid var(--foreground);
  background-color: var(--background);
  padding: 1rem 2rem;
  margin: 2rem;
  box-shadow: 14px 14px var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    box-shadow: 4px 4px rgba(0, 0, 255, 0.2);
  }

  &:active {
    box-shadow: 0px 0px rgba(0, 0, 255, 0.2);
    transform: translate(4px, 4px);
  }
`

export default Button