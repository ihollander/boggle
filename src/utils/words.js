
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

// make a dictionary where keys are all valid starting letters
class DictionaryTrie {
  constructor(letters, dictionary) {
    this.trie = dictionary.reduce((obj, word) => {
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
  }

  hasPrefix(prefix) {
    let cur = this.trie
    for (let c of prefix) {
      if (cur[c] == null) return false
      cur = cur[c]
    }
    return true
  }

  hasWord(word) {
    let cur = this.trie
    for (let c of word) {
      while (cur[c]) {
        if (cur[c] === 0 || cur[c]["$"] === 0) return true
        cur = cur[c]
      }
    }
  }
}

const getNeighbors = index => {
  const x = index % 4
  const y = Math.floor(index / 4)
  let neighbors = []
  for (let nx = Math.max(0, x - 1); nx < Math.min(x + 2, 4); nx++) {
    for (let ny = Math.max(0, y - 1); ny < Math.min(y + 2, 4); ny++) {
      if (!(nx === x && ny === y)) {
        neighbors.push((ny * 4) + nx)
      }
    }
  }
  return neighbors
}

// find all possible solutions for a given set of letters
export const solve = letters => {
  const uppercasedLetters = letters.map(c => c.toUpperCase())
  const dictTrie = new DictionaryTrie(uppercasedLetters, dictionary)

  let foundWords = []

  const wordSearch = (current, index, used) => {
    if (!dictTrie.hasPrefix(current)) return;

    if (
      current.length >= 3 // 3+ letters
      && !foundWords.includes(current) // not already found
      && dictTrie.hasWord(current) // in dictionary
    ) {
      foundWords.push(current)
    }

    for (let next of getNeighbors(index)) {
      if (!used.has(next)) {
        used.add(next)
        wordSearch(current + letters[next], next, used)
        used.delete(next)
      }
    }
  }

  uppercasedLetters.forEach((letter, index) => {
    const used = new Set()
    used.add(index)
    wordSearch(letter, index, used)
  })

  return foundWords.sort()
}