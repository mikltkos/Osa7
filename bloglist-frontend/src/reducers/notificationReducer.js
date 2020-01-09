const initialState = { className: '', message: '' }

export const setNotification = (notification, delay) => {
  console.log('setNotification notification: ', notification)
  console.log('delay: ', delay)
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIF',
      notification
    })
    await setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIF',
        data: { className: '', message: '' }
      })
    }, delay * 1000)
  }
}

const notificationReducer = (state = initialState, action) => {
  console.log('notification action: ', action)
  switch (action.type) {
  case 'SET_NOTIF': {
    console.log('asetetaan nootti: ', action.notification)
    return action.notification
  }
  case 'CLEAR_NOTIF': {
    console.log('piilotetaan nootti')
    return action.data
  }

  default:
    return state
  }
}

export default notificationReducer