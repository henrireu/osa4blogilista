const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

  
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })

test.only('blogs are returned as json', async () => {
    console.log("test starts")
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})
  
test('the first blog title', async () => {
  const response = await api.get('/api/blogs')
  
  const contents = response.body.map(e => e.title)
  assert.strictEqual(contents[0] === "hieno blogi", true)
})

test('id or _id', async () => {
  const response = await api.get('/api/blogs')
  let totuus = false
  if (response.body[0].id) {
    totuus = true
  }
    
   assert.strictEqual(true, totuus)
})


test('blog can be added ', async () => {
  const newBlog = {
    title: "tosi hieno blogi",
    author: "kirjoittajaa",
    url: "kirjoittaja.fii",
    likes: 102
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('if likes not added ', async () => {
  const newBlog = {
    title: "tosi hieno blogi",
    author: "kirjoittajaa",
    url: "kirjoittaja.fii"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  let totuus = false
  if(response.body[response.body.length - 1].likes === 0) {
    totuus = true
  }

  assert.strictEqual(true, totuus)
})

test('if title or url not added ', async () => {
  const newBlog = {
    //title: "tosi hieno blogi",
    author: "kirjoittajaa",
    url: "kirjoittaja.fii",
    likes: 55
  }

  const response = await api.post('/api/blogs').send(newBlog)
  assert.strictEqual(400, response.statusCode)
  
})

test('delete blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()

  console.log("blogien määrä alussa:", blogsAtStart.length, " blogien määrä lopussa", blogsAtEnd.length)

  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length + 1)
})

test('edit blog', async () => {
  const blogs = await helper.blogsInDb()
  const blogToEdit = blogs[0]

  const newBlog = {
    title: "tosi hieno blogi",
    author: "kirjoittajaa",
    url: "kirjoittaja.fii",
    likes: 55
  }

  await api.put(`/api/blogs/${blogToEdit.id}`).send(newBlog)
  
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual("tosi hieno blogi", blogsAtEnd[0].title)
})

after(async () => {
  await mongoose.connection.close()
})