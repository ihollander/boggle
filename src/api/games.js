const BASE_URL = process.env.REACT_APP_HTTP_ROOT

const fetchAndParse = async (url, options) => {
  const response = await fetch(url, options)
  if (response.status < 500) {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      throw data
    }
  } else {
    throw response
  }
}

export const createGame = ({ username, gridSize = 4, timer = 120 }) => {
  return fetchAndParse(BASE_URL + "/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, gridSize, timer })
  })
}

export const getGames = () => {
  return fetchAndParse(BASE_URL + "/games")
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

export const submitWords = (id, { username, words }) => {
  return fetchAndParse(BASE_URL + `/games/${id}/submit_words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, words })
  })
}