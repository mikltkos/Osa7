import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = (props) => {
  console.log('Notification: ', props.notification)
  if(props.notification.message === ''){
    return null
  }

  return (
    <Alert variant={props.notification.className}>
      {props.notification.message}
    </Alert>
  )
}

const mapStateToProps = (state) => {
  return{
    notification: state.notification
  }
}

export default connect(
  mapStateToProps
)(Notification)