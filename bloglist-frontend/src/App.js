import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import Bloglist from './components/Bloglist'
import Notification from './components/Notification'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import { setUser, logoutUser } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
import { useField } from './hooks'
import { Form, Button, Navbar, Nav } from 'react-bootstrap'
import './App.css'

const App = (props) => {
  const blogFormRef = React.createRef()
  const username = useField('text')
  const password = useField('password')
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const usernameInput = { 'type': username.type, 'value': username.value, 'onChange': username.onChange }
  const passwordInput = { 'type': password.type, 'value': password.value, 'onChange': password.onChange }

  useEffect(() => {
    props.initializeBlogs()
    props.initializeUsers()
  }, [])

  useEffect(() => {
    console.log('useEffect logged')
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    console.log('local storage: ', loggedUserJSON)
    if(loggedUserJSON){
      console.log('user tallennettu local storageen, dispatchataan storeen')
      const user = JSON.parse(loggedUserJSON)
      console.log('user ', user.name, ' is logged in')
      blogService.setToken(user.token)
      props.setUser(user)
    }
  }, [])

  const handleLogout = async (event) => {
    console.log('handleLogout')
    event.preventDefault()
    try{
      const user = props.user
      props.setNotification({ className: 'success', message: `${user.name} logged out` }, 5)
      props.logoutUser()
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogin = async (event) => {
    console.log('handleLogin')
    event.preventDefault()
    console.log('username: ', username.value, 'password: ', password.value)
    try{
      const user = await loginService.login({
        username: username.value, password: password.value
      })
      console.log('user: ', user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      props.setNotification({ className: 'success', message: `${user.username} logged in` }, 5)
      blogService.setToken(user.token)
      props.setUser(user)
      username.reset()
      password.reset()
    } catch(error) {
      props.setNotification({ className: 'danger', message: 'wrong username or password' }, 5)
    }
  }

  const loginForm = () => (
    <div className='container'>
      <Notification />
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <h2>Log in to application</h2>
          <Form.Label>username</Form.Label>
          <Form.Control id='username' {...usernameInput}/>
          <Form.Label>password</Form.Label>
          <Form.Control id='password' {...passwordInput}/>
          <Button variant='primary' type="submit">Login</Button>
        </Form.Group>
      </Form>
    </div>
  )

  const handleAddBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    const blogObject = {
      title: title.value,
      author: author.value,
      url: url.value
    }

    console.log('UUSI BLOGI: ', blogObject)
    if(blogObject.title.length > 0 && blogObject.author.length > 0 && blogObject.url.length > 0){
      console.log('lisätään uusi blogi')
      props.createBlog(blogObject, props.user)
      props.setNotification({ className: 'success', message: `a new blog ${title.value} by ${author.value} added` }, 5)
      title.reset()
      author.reset()
      url.reset()
    } else {
      console.log('tyhjät kentät')
      props.setNotification({ className: 'danger', message: 'please, fill in all fields!' }, 5)
    }
  }

  const userById = (id) => {
    console.log('userById props.users: ', props.users)
    console.log('id: ', id)
    return props.users.find(user => user.id === id)
  }

  const blogById = (id) => {
    console.log('blogById props.blogs: ', props.blogs)
    console.log('id: ', id)
    return props.blogs.find(blog => blog.id === id)
  }

  return (
    <div>
      <Router>
        {props.user === null ?
          loginForm() :
          <div>
            <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
              <Navbar.Toggle aria-controls='responsive-navbar-nav' />
              <Navbar.Collapse id='responsive-navbar-nav' >
                <Nav className='mr-auto'>
                  <Nav.Link href='#' as='span'>
                    <Link to='/blogs'>blogs</Link>
                  </Nav.Link>
                  <Nav.Link href='#' as='span'>
                    <Link to='/users'>users</Link>
                  </Nav.Link>
                  <Nav.Link href='#' as='span'>
                    {props.user
                      ? <>{props.user.name} logged in <Button onClick={handleLogout}>logout</Button></>
                      : <Link to='/login'>login</Link>
                    }
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <Notification />
            <Route exact path="/" render={() =>
              <Bloglist
                blogs={props.blogs}
                handleAddBlog={handleAddBlog}
                blogFormRef={blogFormRef}
                title={title}
                author={author}
                url={url}
              />
            } />
            <Route exact path="/users" render={() =>
              <Users users={props.users} />
            } />
            <Route exact path="/users/:id" render={({ match }) =>
              <User user={userById(match.params.id)} />
            }/>
            <Route exact path="/blogs" render={() =>
              <Bloglist
                blogs={props.blogs}
                handleAddBlog={handleAddBlog}
                blogFormRef={blogFormRef}
                title={title}
                author={author}
                url={url}
              />
            } />
            <Route exact path="/blogs/:id" render={({ match }) =>
              <Blog blog={blogById(match.params.id)} user={props.user} />
            }/>
          </div>
        }
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    users: state.users,
    blogs: state.blogs,
    notification: state.notification
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  initializeUsers,
  setUser,
  setNotification,
  logoutUser,
  createBlog
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
