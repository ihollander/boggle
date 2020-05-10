import React from 'react'
import styled from 'styled-components'
import { getScore } from '../../utils/words'

const ListContainer = styled.ul`
  list-style: none;
  height: 35vh;
  border: 4px solid black;
  overflow-y: scroll;
  padding: 0.5rem;
`

const Word = styled.li`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;

  .score {
    opacity: 0.7;
  }
`

const SelectedWord = styled(Word)`
  color: ${props => colorMap[props.tileState]};
`

const colorMap = {
  0: "#aaa",
  1: "green",
  2: "red"
}

const WordList = ({ words, selectedWord, tileState }) => {
  return (
    <ListContainer>
      <SelectedWord tileState={tileState}>
        <span>{selectedWord}</span>
        <span className="score">{selectedWord.length ? `+${getScore(selectedWord)}` : null}</span>
      </SelectedWord>
      {words.map(word =>
        <Word key={word}>
          <span>{word}</span>
          <span className="score">+{getScore(word)}</span>
        </Word>
      )}
    </ListContainer>
  )
}

export default WordList