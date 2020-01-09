import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeUsers } from '../reducers/usersReducer'
import { Table } from 'react-bootstrap'


const Users = (props) => {
  useEffect(() => {
    console.log('useEffect Users')
    props.initializeUsers()
  }, [])

  console.log('Users props: ', props)
  const users = props.users
  const padding = { padding: 5 }

  return(
    <div className='container'>
      <h2>users</h2>
      <Table striped>
        <thead>
          <tr><th></th><th>blogs created</th></tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link style={padding} to={`/users/${user.id}`}>{user.name} </Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}

const mapDispatchToProps = {
  initializeUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)