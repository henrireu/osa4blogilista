const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    //const user = await User.findById(decodedToken.id)
    const user = request.user


    let likes = 0
    if(body.likes) {
        likes = body.likes
    }
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: likes,
        user: user._id
    })

    if (!blog.title || !blog.url) {
        response.status(400).end()
    } else {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    const user = request.user

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(decodedToken) {
      if(blog.user.toString() === user.id) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
      } else {
        return response.status(401).json({ error: 'token invalid' })
      }
    } else {
      return response.status(401).json({ error: 'token invalid' })
    }

})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(blog)
})

module.exports = blogsRouter
