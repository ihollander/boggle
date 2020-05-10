
import dictionary from './dictionary.json'

export const isValidWord = word => {
  if (word.length < 3) return false;

  word = word.toUpperCase()
  return !!dictionary.find(entry => word === entry)
}

export const getScore = word => {
  switch (word.length) {
    case 0:
    case 1:
    case 2:
      return 0;
    case 3:
    case 4:
      return 1;
    case 5:
      return 2;
    case 6:
      return 3;
    case 7:
      return 5;
    default:
      return 11
  }
}

class Node {
  constructor(value, parent = null) {
    this.value = value
    this.parent = parent
    this.children = []
  }
}

class Tree {
  constructor(data) {
    this.root = new Node(data)
  }
}

// make a dictionary where keys are all valid starting letters
const makeDictionary = letters => dictionary.reduce((obj, word) => {
  // regex test, 3+ letters match
  if (!word.match(new RegExp(`^[${letters}]{3,}$`, "i"))) return obj

  let cur = obj
  for (let i = 0; i < word.length; i++) {
    let letter = word[i]
    let pos = cur[letter]

    if (pos == null) {
      cur = cur[letter] = i === word.length - 1 ? 0 : {}
    } else if (pos === 0) {
      cur = cur[letter] = { $: 0 }
    } else {
      cur = cur[letter]
    }

  }

  return obj
}, {})

const findPrefix = (dictionary, prefix) => {
  let cur = dictionary
  for (let c of prefix) {
    if (cur[c] == null) return false
    cur = cur[c]
  }
  return true
}

const findWord = (dictionary, word) => {
  let cur = dictionary
  for (let c of word) {
    while (cur[c]) {
      if (cur[c] === 0 || cur[c]["$"] === 0) {
        return true
      }
      cur = cur[c]
    }
  }
}

// refactor this shiz
// const getNeighbors = (letters, startIndex) => {
//   let validIndices
//   if (startIndex % 4 === 0) {
//     validIndices = [
//       startIndex - 4, startIndex - 3,
//       startIndex + 1,
//       startIndex + 4, startIndex + 5
//     ]
//   } else if (startIndex % 4 === 3) {
//     validIndices = [
//       startIndex - 5, startIndex - 4,
//       startIndex - 1,
//       startIndex + 3, startIndex + 4
//     ]
//   } else {
//     validIndices = [
//       startIndex - 5, startIndex - 4, startIndex - 3,
//       startIndex - 1, startIndex + 1,
//       startIndex + 3, startIndex + 4, startIndex + 5
//     ]
//   }

//   return letters
//     .map((letter, index) => ({ letter, index }))
//     .filter(({ index }) => validIndices.includes(index))
// }

const getNeighbors = (x, y) => {
  let neighbors = []
  for (let nx = Math.max(0, x - 1); nx < Math.min(x + 2, 4); nx++) {
    for (let ny = Math.max(0, y - 1); ny < Math.min(y + 2, 4); ny++) {
      if (!(nx === x && ny === y)) {
        neighbors.push([nx, ny])
      }
    }
  }
  return neighbors
}


// input: [
// "S", "G", "R", "N", 
// "H", "E", "E", "T", 
// "D", "I", "B", "T", 
// "T", "A", "H", "U"
// ]
export const solve = letters => {
  const dict = makeDictionary(letters.join("").toUpperCase())
  console.log(dict)

  if (dict && !Object.keys(dict).length) return;

  // matrixify
  const grid = letters.reduce((grid, letter, index) => {
    const row = Math.floor(index / 4)
    grid[row] = grid[row] || []
    grid[row].push(letter)
    return grid
  }, [])

  let foundWords = []

  // recursive solution
  const wordSearch = (current, x, y, used) => {
    if (!findPrefix(dict, current)) return;

    if (current.length >= 3) {
      if (!foundWords.includes(current) && findWord(dict, current)) {
        foundWords.push(current)
      }
    }

    for (let [nx, ny] of getNeighbors(x, y)) {
      const index = ny * 4 + nx
      if (!used.has(index)) {
        used.add(index)
        wordSearch(current + letters[index], nx, ny, used)
        used.delete(index)
      }
    }
  }

  grid.forEach((row, y) => {
    row.forEach((letter, x) => {
      const index = y * 4 + x
      const used = new Set()
      used.add(index)
      wordSearch(letter, x, y, used)
      console.log(foundWords)
    })
  })

  return foundWords
}

// regex check against dictionary
// bogglable = re.compile('[' + alphabet + ']{3,}$', re.I).match
