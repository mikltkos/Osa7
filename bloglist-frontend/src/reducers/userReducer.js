//import loginService from '../services/login'


export const setUser = content => {
  console.log('login: ', content)
  return async dispatch => {
    dispatch({
      type: 'SET_USER',
      data: content
    })
  }
}

export const logoutUser = () => {
  return async dispatch => {
    await window.localStorage.removeItem('loggedBlogappUser')
    dispatch({
      type: 'LOGOUT'
    })
  }
}


const userReducer = (state = null, action) => {
  console.log('user action: ', action)
  switch(action.type){
  case 'SET_USER':
    return action.data
  case 'LOGOUT': {
    return null
  }
  default:
    return state
  }
}

export default userReducer