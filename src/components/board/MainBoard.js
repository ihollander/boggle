import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import Dice from './Dice'

import { gameStates } from '../../constants'
import { setSelected } from '../../store/game/actions'
import { useDispatch } from 'react-redux'

const BoardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px solid var(--foreground);
  overscroll-behavior-y: none;
  touch-action: none;
  position: relative;
`

const Blurrer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(1px);
`

const isValidSelection = (selected, index) => {
  if (selected.length === 0) return true

  const lastSelection = selected[selected.length - 1]
  let neighbors = []

  const x = lastSelection % 4
  const y = Math.floor(lastSelection / 4)
  for (let nx = Math.max(0, x - 1); nx < Math.min(x + 2, 4); nx++) {
    for (let ny = Math.max(0, y - 1); ny < Math.min(y + 2, 4); ny++) {
      if (!(nx === x && ny === y)) {
        neighbors.push((ny * 4) + nx)
      }
    }
  }

  console.log(neighbors, selected, index)
  return neighbors.includes(index) && !selected.includes(index)
}

const isValidSelection2 = (selectedLetters, selected, index) => {
  if (selected.length === 0) return true

  const lastSelection = selectedLetters[selectedLetters.length - 1]
  let neighbors = []
  lastSelection.forEach(selection => {
    const x = selection % 4
    const y = Math.floor(selection / 4)
    for (let nx = Math.max(0, x - 1); nx < Math.min(x + 2, 4); nx++) {
      for (let ny = Math.max(0, y - 1); ny < Math.min(y + 2, 4); ny++) {
        if (!(nx === x && ny === y)) {
          neighbors.push((ny * 4) + nx)
        }
      }
    }
  })

  return neighbors.includes(index) && !selected.includes(index)
}


class Node {
  constructor(value, level, parent = null) {
    this.value = value
    this.level = level
    this.parent = parent
    this.children = []
  }

  hasParentValue(value) {
    let next = this
    while (next.parent !== null) {
      if (next.value === value) return true
      next = next.parent
    }
    return false
  }

  toArray() {
    let next = this
    let result = [next.value]
    while (next.parent !== null) {
      next = next.parent
      result.unshift(next.value)
    }
    return result
  }
}

class Tree {
  constructor(value) {
    this.root = new Node(value, 0)
  }

  add(parentValue, value, level) {
    const node = new Node(value, level)
    const parent = this.find(parentValue, level - 1)
    parent.children.push(node)
  }

  find(value, level) {
    let queue = [this.root]
    while (queue.length) {
      let node = queue.shift()
      if (node.value === value && node.level === level) {
        return node
      }
      queue.push(...node.children)
    }
    return null
  }

  nodesAtLevel(level) {
    let queue = [this.root]
    let leaves = []
    while (queue.length) {
      let node = queue.shift()
      if (node.level === level) {
        leaves.push(node)
      }
      queue.push(...node.children)
    }
    return leaves
  }
}

const findPath = indicesArray => {
  if (!indicesArray.length) return;
  if (indicesArray.length === 1) {
    return [indicesArray[0][0]]
  }

  const roots = indicesArray[0]
  const rest = indicesArray.slice(1)
  for (let i = 0; i < roots.length; i++) {
    const tree = new Tree(roots[i])

    for (let j = 0; j < rest.length; j++) {
      const restIndices = rest[j]
      const nodes = tree.nodesAtLevel(j)

      for (let k = 0; k < nodes.length; k++) {
        for (let l = 0; l < restIndices.length; l++) {
          const node = nodes[k]
          const letterIndex = restIndices[l]
          const selection = node.toArray()
          if (!node.hasParentValue(letterIndex) && isValidSelection(selection, letterIndex)) {
            const addedNode = new Node(letterIndex, j + 1, node)
            node.children.push(addedNode)
            if (j + 1 === rest.length) {
              return addedNode.toArray()
            }
          }
        }
      }
    }
  }
}

const MainBoard = ({ dice, currentSelected, gameState, validatingState, submitWord, selectLetter }) => {
  const dispatch = useDispatch()

  const containerRef = useRef()
  useEffect(() => {
    containerRef.current.focus()
  }, [])

  const selectingRef = useRef(false)
  const lastElementTouchRef = useRef()
  const [typedWord, setTypedWord] = useState("")

  const reffedDice = dice.map(die => {
    const ref = React.createRef()
    return { ...die, ref }
  })

  const handleSelectStart = index => {
    selectingRef.current = true
    handleSelect(index)
  }

  const handleSelect = index => {
    if (gameState === gameStates.PLAYING && selectingRef.current) {
      selectLetter(index)
    }
  }

  const handleSelectEnd = () => {
    selectingRef.current = false
    submitWord()
  }

  const handleTouchMove = ({ touches }) => {
    const el = document.elementFromPoint(touches[0].clientX, touches[0].clientY)
    if (el !== lastElementTouchRef.current) {
      const die = reffedDice.find(die => die.ref.current === el)
      if (die && !die.selected) {
        handleSelect(die.index)
      }
    }
    lastElementTouchRef.current = el
  }

  const handleKeyDown = ({ key, keyCode }) => {
    // letters
    if (keyCode >= 65 && keyCode <= 90) {
      const nextIndices = dice.filter(die => die.face === key.toUpperCase()).map(die => die.index)

      const selected = typedWord.split("").map(char =>
        dice.filter(die => die.face === char).map(die => die.index)
      )

      // TODO: cant't just check the current selection, need to check the 
      const valid = nextIndices.filter(index => isValidSelection2(selected, currentSelected, index))
      if (valid.length) {
        const updatedWord = typedWord + key.toUpperCase()
        const selected = updatedWord.split("").map(char =>
          dice.filter(die => die.face === char).map(die => die.index)
        )
        const path = findPath(selected)
        console.log(updatedWord, selected, path)

        dispatch(setSelected(path))
        setTypedWord(updatedWord)
      }
    } else if (keyCode === 8) {
      const updatedWord = typedWord.slice(0, typedWord.length - 1)
      if (updatedWord.length === 0) {
        dispatch(setSelected([]))
      } else {
        const selected = updatedWord.split("").map(char =>
          dice.filter(die => die.face === char).map(die => die.index)
        )
        const path = findPath(selected)
        console.log(updatedWord, selected, path)

        dispatch(setSelected(path))
      }
      setTypedWord(updatedWord)
    } else if (keyCode === 13) {
      setTypedWord("")
      // submit!
      submitWord()
    }
  }

  return (
    <BoardContainer
      ref={containerRef}
      tabIndex="-1"
      onKeyDown={handleKeyDown}
      onTouchEnd={handleSelectEnd}
      onMouseUp={handleSelectEnd}
      onTouchMove={handleTouchMove}
    >
      {reffedDice.map(({ index, face, selected, ref }) => {
        return <Dice
          key={index}
          ref={ref}
          index={index}
          validatingState={selected ? validatingState : 0}
          selected={selected}
          face={face}
          handleSelectStart={handleSelectStart}
          handleSelect={handleSelect}
        />
      })}
      {gameState === gameStates.ENDED && <Blurrer />}
    </BoardContainer>
  )
}

export default MainBoard