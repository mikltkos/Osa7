import blogService from '../services/blogs'

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (content, user) => {
  console.log('createBlog content: ', content)
  return async dispatch => {
    const newBlog = await blogService.create(content)
    console.log('blogReducer newBlog: ', newBlog)
    dispatch({
      type: 'NEW_BLOG',
      data: {
        blog: newBlog,
        user: user
      }
    })
  }
}

export const likeBlog = (blogId, blog) => {
  console.log('like blog: ', blogId, blog)
  return async dispatch => {
    const newBlog = await blogService.update(blogId, blog)
    dispatch({
      type: 'LIKE_BLOG',
      data: {
        id: newBlog.id
      }
    })
  }
}

export const addComment = (blogId, blog) => {
  console.log('add comment blog.id to:: ', blogId)
  return async dispatch => {
    const newBlog = await blogService.comment(blogId, blog)
    console.log('addComment dispatcer newBlog::: ', newBlog)
    dispatch({
      type: 'ADD_COMMENT',
      data: newBlog
    })
  }
}

export const removeBlog = (blogId, blogs) => {
  console.log('remove blog with id. ', blogId)
  return async dispatch => {
    const response = await blogService.remove(blogId)
    console.log('removeBlog action creator -> response: ', response)
    dispatch({
      type: 'REMOVE_BLOG',
      data: {
        id: blogId,
        blogs: blogs
      }
    })
  }
}

const blogReducer = (state = [], action) => {
  console.log('blog action: ', action)
  switch(action.type){
  case 'INIT_BLOGS':
    return action.data.sort((a, b) => b.likes - a.likes)
  case 'NEW_BLOG': {
    const blog = action.data.blog
    const user = action.data.user
    const newBlog = {
      ...blog,
      user: {
        username: user.username,
        name: user.name
      }
    }
    console.log('newBlog: ', newBlog)
    return state.concat(newBlog)
  }
  case 'LIKE_BLOG': {
    const id = action.data.id
    const blogToLike = state.find(n => n.id === id)
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1
    }
    const newState = state.map(blog => blog.id !== id ? blog : likedBlog)
    newState.sort((a, b) => b.likes - a.likes)
    return newState
  }
  case 'ADD_COMMENT': {
    const id = action.data.id
    const newState = state.map(blog => blog.id !== id ? blog : action.data)
    console.log('newState: ', newState)
    return newState
  }
  case 'REMOVE_BLOG': {
    const id = action.data.id
    const blogs = action.data.blogs
    console.log('blogReducer -> REMOVE_BLOG -> blogs: ', blogs)
    let newState = blogs.filter(blog => blog.id !== id)
    console.log('newState: ', newState)
    return newState
  }
  default:
    return state
  }
}

export default blogReducer