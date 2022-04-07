import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import usersReducer from './features/users'
import userReducer from './features/user'
// import user from './features/user'
import postsReducer from './features/posts'
import commentsReducer from './features/comments'
import miniCommentsReducer from './features/miniComments'

const root = ReactDOM.createRoot(document.getElementById("root"))

const store = configureStore({
  reducer: {
    //ADDED: add reducers here
    users: usersReducer,
    user: userReducer,
    posts: postsReducer,
    comments: commentsReducer,
    miniComments: miniCommentsReducer,
  }
})

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
