import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;

  label {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  select {
    appearance: none;
    border-radius: 0;
  }

  select,
  input {
    color: var(--foreground);
    border: 0.2rem solid var(--foreground);
    background-color: var(--background);
    width: 100%;
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0.25rem 1rem;
    margin-bottom: 2rem;
  }
`

export default Form