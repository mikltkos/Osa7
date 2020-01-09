
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'
import blogReducer from './reducers/blogReducer'
import App from './App'

const reducer = combineReducers({
  notification: notificationReducer,
  user: userReducer,
  users: usersReducer,
  blogs: blogReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

const renderApp = () => {
  console.log('rendering App')
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )}

renderApp()

store.subscribe(
  renderApp
)
