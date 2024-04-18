const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    let number = 0;
    blogs.map(blog => {
        number = number + blog.likes
    })
    return number
}

const favoriteBlog = (blogs) => {
    let name = ""
    let winner = 0
    blogs.map(blog => {
        if (blog.likes > winner) {
            winner = blog.likes
            name = blog.title
        }
    })
    return name
}

const mostBlogs = (blogs) => {
    let lista = []
    blogs.map(blog => {
        lista.push(blog.author)
    })
    let luku = 0
    let nimi = lista[0]

    let hamylista = lista
    lista.map(a => {
        let numero = 0
        let nimii = a
        hamylista.map(b => {
            if (a === b) {
                numero = numero + 1
            }
        })
        if (numero > luku) {
            nimi = nimii
            luku = numero
        }
    })
    let objekti = {
        author: nimi,
        blogs: luku
    }
    return objekti
}

const mostLikes = (blogs) => {
    let lista = []
    blogs.map((blog, index) => {
        let totuus = false
        let indeksi = -1
        let tykkaykset = 0

        for (let x = 0; x < lista.length; x++) {
            if (blog.author === lista[x].author) {
                totuus = true
                indeksi = x
                tykkaykset = blog.likes
            }
        }

        if (totuus === false) {
            const objekti = {
               author: blog.author,
               likes: blog.likes
            }
            lista.push(objekti)
        }
        if (totuus === true) {
            const objekti = {
                author: blog.author,
                likes: tykkaykset + lista[indeksi].likes
            }
            lista.splice(indeksi, 1, objekti)
        }
    })
    let palautus = {
        author: '',
        likes: 0
    }
    lista.map(l => {
        if (l.likes > palautus.likes) {
            palautus.author = l.author,
            palautus.likes = l.likes
        }
    })
    return palautus
  }



  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }