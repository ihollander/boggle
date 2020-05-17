import ReactGA from 'react-ga'

const BASE_URL = process.env.REACT_APP_HTTP_ROOT

const defaultHeaders = {
  "Content-Type": "application/json"
}

const fetchAndParse = async (url, options) => {
  const response = await fetch(url, options)
  if (response.status < 500) {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      console.error(data)
      ReactGA.exception({
        description: JSON.stringify(data),
        fatal: true
      });
      throw data
    }
  } else {
    throw response
  }
}

export const createGame = ({ username, gridSize = 4, timer = 120 }) => {
  return fetchAndParse(BASE_URL + "/games", {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ username, gridSize, timer })
  })
}

export const getGames = () => {
  return fetchAndParse(BASE_URL + "/games")
}

export const getGame = name => {
  return fetchAndParse(BASE_URL + `/games/${name}`)
}

export const startGame = id => {
  return fetchAndParse(BASE_URL + `/games/${id}/start`, {
    method: "PATCH"
  })
}

export const endGame = id => {
  return fetchAndParse(BASE_URL + `/games/${id}/end`, {
    method: "PATCH"
  })
}

export const submitWords = (id, { username, words, score }) => {
  return fetchAndParse(BASE_URL + `/games/${id}/submit_words`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ username, words, score })
  })
}

export const highScores = () => {
  return fetchAndParse(BASE_URL + "/games/high_scores")
}