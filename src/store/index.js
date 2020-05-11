import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import gameReducer from './game/reducer'
import userReducer from './user/reducer'

const rootReducer = combineReducers({
  game: gameReducer,
  user: userReducer,
})

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
))

export default store