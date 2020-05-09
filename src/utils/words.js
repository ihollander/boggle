
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