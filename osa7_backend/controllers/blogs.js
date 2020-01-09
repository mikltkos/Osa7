
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')


blogsRouter.get('/', async (request, response, next) => {
    try{
        const blogs = await Blog
            .find({}).populate('user', { username: 1, name: 1 , id: 1})
        response.json(blogs.map(blog => blog.toJSON()))
    } catch(error){
        next(error)
    }

})
  
blogsRouter.post('/', async (request, response, next) => {

    const body = request.body

    console.log('body: ', body)

    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if(!request.token || !decodedToken.id) {
            logger.error('token missing or invalid')
            return response.status(401).json({error: 'token missing or invalid'})           
        }

        const user = await User.findById(decodedToken.id)
    
        if((body.title === undefined && body.url === undefined) || (body.title === '' && body.url === '')){
            logger.error('bad request')
            response.status(400).json('title and url is missing')
        } else {
            const blog = new Blog({
                title: body.title,
                author: body.author,
                url: body.url,
                likes: body.likes === undefined ? 0 : body.likes,
                user: user._id
            })

            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()
            response.json(savedBlog.toJSON())
        }
    } catch(exeption) {
        next(exeption)

    }
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
    const id = request.params.id
    console.log('post comments')
    const body = request.body
    console.log('body comment: ', body)

    try{
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const blogToEdit = await Blog.findById(id)
        if(!request.token || !decodedToken.id) {
            logger.error('token missing or invalid')
            return response.status(401).json({error: 'token missing or invalid'})
        }
        
        if((body.title === undefined && body.url === undefined) || (body.title === '' && body.url === '')){
            logger.error('bad request')
            response.status(400).json('title and url is missing')
        } else {
            const newBlog = {
                title: body.title === undefined ? blogToEdit.title : body.title,
                author: body.author === undefined ? blogToEdit.author : body.author,
                url: body.url === undefined ? blogToEdit.url : body.url,
                likes: body.likes === undefined ? 0 : body.likes,
                comments: body.comments === undefined ? '' : body.comments
            }

            const editedBlog = await Blog.findByIdAndUpdate(id, newBlog, { new: true}).populate('user', { username: 1, name: 1 , id: 1})
            response.status(200).json(editedBlog.toJSON())
        }
    } catch(exeption) {
        next(exeption)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
 
    const blogId = request.params.id

    try{

        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        const blogToDelete = await Blog.findById(blogId)
        if(!request.token || !decodedToken.id) {
            logger.error('token is missing or invalid')
            return response.status(401).json({error: 'token is missing or invalid'}).end()
        } else if(user._id.toString() !== blogToDelete.user.toString()) {
            logger.error('user must be owner of the blog')
            return response.status(400).json({error: 'user must be owner of the blog'}).end()
        }

        await Blog.findByIdAndRemove(blogId)
        
        response.status(204).end()
    } catch (exeption) {
        next(exeption)

    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const id = request.params.id
    try{
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        //const user = await User.findById(decodedToken.id)
        const blogToEdit = await Blog.findById(id)

        if(!request.token || !decodedToken.id) {
            logger.error('token is missing or invalid')
            return response.status(401).json({error: 'token is missing or invalid'}).end()
        }
        if(!body.title && !body.author && !body.url && !body.likes){
            logger.error('no content')
            response.status(400).json({error: 'no content'}).end()
        }
        const newBlog = {
            title: body.title === undefined ? blogToEdit.title : body.title,
            author: body.author === undefined ? blogToEdit.author : body.author,
            url: body.url === undefined ? blogToEdit.url : body.url,
            likes: body.likes === undefined ? 0 : body.likes,
            comments: body.comments === undefined ? '' : body.comments
        }
    
        const editedBlog = await Blog.findByIdAndUpdate(id, newBlog, { new: true}).populate('user', { username: 1, name: 1 , id: 1})
        response.status(200).json(editedBlog.toJSON())
    } catch(error){
        next(error)
 
    }
})

module.exports = blogsRouter
