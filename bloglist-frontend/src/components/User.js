import React from 'react'


const User = ({ user }) => {
  console.log('User component')
  if(user === undefined){
    console.log('user undefined')
    return null
  }
  console.log('user: ', user)
  return(
    <div className='container'>
      <h2>{user.name}</h2>
      <div className='container'>
        <h4>added blogs</h4>
        <ul>
          {user.blogs.map(blog =>
            <li key={blog.id}>{blog.title}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default User