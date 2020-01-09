import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Togglable from '../components/Togglable'
import NewBlogForm from '../components/NewBlogForm'
import { Table } from 'react-bootstrap'

const Bloglist = (props) => {
  const blogs = props.blogs
  return(
    <div className='container'>
      <h2>blogs</h2>
      <Togglable buttonLabel="new blog" ref={props.blogFormRef}>
        <NewBlogForm
          handleAddBlog={props.handleAddBlog}
          title={props.title}
          author={props.author}
          url={props.url}
        />
      </Togglable>
      <div>
        <Table striped>
          <tbody>
            {blogs.map(blog =>
              <tr key={blog.id} className='blogTitle'>
                <td><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs
  }
}

export default connect(mapStateToProps)(Bloglist)