import React from 'react'

const UserBloglist = (props) => {
  return(
    <div className='blogs'>
      <ul>
        {props.blogs.map((blog) =>
          <li key={blog.id}>
              blog={blog}
              user={props.user}
          </li>
        )}
      </ul>
    </div>
  )
}

export default UserBloglist