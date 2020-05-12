
import dictionary from './dictionary.json'

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
export class BoggleSolver {
  constructor(letters) {
    this.letters = letters.map(c => c.toUpperCase())
    this.trie = dictionary.reduce((obj, word) => {
      // regex test, 3+ letters match
      if (!word.match(new RegExp(`^[${this.letters}]{3,}$`, "i"))) return obj

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

  solve() {
    let foundWords = []

    const wordSearch = (current, index, used) => {
      if (!this.isValidPrefix(current)) return;

      if (
        current.length >= 3 // 3+ letters
        && !foundWords.includes(current) // not already found
        && this.isValidWord(current) // in dictionary
      ) {
        foundWords.push(current)
      }

      for (let next of this.getNeighbors(index)) {
        if (!used.has(next)) {
          used.add(next)
          wordSearch(current + this.letters[next], next, used)
          used.delete(next)
        }
      }
    }

    this.letters.forEach((letter, index) => {
      const used = new Set()
      used.add(index)
      wordSearch(letter, index, used)
    })

    return foundWords.sort()
  }

  isValidPrefix(prefix) {
    let cur = this.trie
    for (let c of prefix) {
      if (cur[c] == null) return false
      cur = cur[c]
    }
    return true
  }

  isValidWord(word) {
    let cur = this.trie
    for (let c of word) {
      if (cur[c] == null) return false
      cur = cur[c]
    }
    return cur === 0 || cur["$"] === 0
  }

  getNeighbors(index) {
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

  static getTotalPoints(words) {
    return words.reduce((sum, word) => sum + BoggleSolver.getPoints(word), 0)
  }

  static getPoints(word) {
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
}
