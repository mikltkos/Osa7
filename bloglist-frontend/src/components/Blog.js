import React, { useState } from 'react'
import { connect } from 'react-redux'
import { removeBlog, likeBlog, addComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'

const Blog = (props) => {
  const [comment, setComment] = useState([])
  console.log('Blog props: ', props)
  console.log('Blog blog: ', props.blog)
  console.log('Blog props.user: ')
  if(props.blog === undefined){
    return null
  }

  const handleRemove = () => {
    console.log('remove')
    const result = window.confirm(`remove blog ${props.blog.title} by ${props.blog.author}`)
    if(result === true){
      props.setNotification({ className: 'success', message: `blog ${props.blog.title} deleted` }, 5)
      props.removeBlog(props.blog.id, props.blogs)
    }
  }

  const handleAddLikes = () => {
    console.log('handleAddLikes')
    const blogObject = {
      title: props.blog.title,
      author: props.blog.author,
      url: props.blog.url,
      likes: props.blog.likes + 1,
      user: props.blog.user
    }
    console.log('blog.user.name: ', props.blog.user.name)
    props.likeBlog(props.blog.id, blogObject)
    props.setNotification({ className: 'success', message: `one likes added to ${props.blog.title}` }, 5)
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    console.log('handleAddComment')
    if(!props.blog.comments){
      const blogObject = {
        title: props.blog.title,
        author: props.blog.author,
        url: props.blog.url,
        likes: props.blog.likes,
        comments: comment,
        user: props.blog.user
      }
      props.addComment(props.blog.id, blogObject)
    } else {
      const comments = props.blog.comments.map(c => c)
      comments.push(comment)
      const blogObject = {
        title: props.blog.title,
        author: props.blog.author,
        url: props.blog.url,
        likes: props.blog.likes,
        comments: comments,
        user: props.blog.user
      }
      props.addComment(props.blog.id, blogObject)
    }
    setComment('')
    console.log(comment)
    props.setNotification({ className: 'success', message: `comment added to ${props.blog.title}` }, 5)
  }

  const addRemoveButton = () => {
    console.log('addRemoveButton')
    if(props.blog.user.name === props.user.name){
      return <div><Button className="remove" onClick={handleRemove}>remove</Button></div>
    }
    return null
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value)
    console.log(comment)
  }

  const padding = { padding: 20 }

  return(
    <div className='container'>
      <h3>{props.blog.title}</h3>
      <div className ='container'>
        <div><a href={props.blog.url}>{props.blog.url}</a></div>
        <div>{props.blog.likes} likes <Button onClick={handleAddLikes}>like</Button></div>
        <div>added by {props.blog.user.name}</div>
        {addRemoveButton()}
      </div>
      <div>
        <Form onSubmit={handleAddComment}>
          <div>
            <h3>comments</h3>
            <div className='container'>
              <Form.Control id='comment' value={comment} onChange={handleCommentChange} />
              <Button type="submit">add comment</Button>
            </div>
            <div>
              <List-Group>
                <div style={padding}>
                  {props.blog.comments.map((comment, index) =>
                    <li key={index}>{comment}</li>
                  )}
                </div>
              </List-Group>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return{
    blogs: state.blogs,
    user: state.user
  }
}

const mapDispatchToProps = {
  setNotification,
  removeBlog,
  likeBlog,
  addComment
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Blog)

