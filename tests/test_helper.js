const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: "hieno blogi",
      author: "kirjoittaja",
      url: "kirjoittaja.fi",
      likes: 10
    },
    {
      title: "todella hieno blogi",
      author: "kirjoittaja2",
      url: "kirjoittaja2.fi",
      likes: 12
    },
]

const nonExistingId = async () => {
    const blog = new Blog({ author: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
}
  
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}