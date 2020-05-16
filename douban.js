const fs = require('fs')

const request = require('syncrequest')
const cheerio = require('cheerio')

const log = console.log.bind(console)

class Movie {
    constructor() {
        this.name = ''
        this.score = 0
        this.quote = ''
        this.ranking = 0
        this.coverUrl = ''
        this.ratings = ''
        this.year = ''
        this.area = ''
        this.type = ''
    }
}


const movieFromDiv = (div) => {
    let e = cheerio.load(div)

    let movie = new Movie()

    movie.name = e('.title').text()
    let score = e('.rating_num').text()
    movie.score = Number(score)
    movie.quote = e('.inq').text()

    let d = e('.bd').find('p').text()
    let space = '                            '
    movie.year = d.split(space)[2].slice(0, 4)

    movie.area = d.split(' / ')[1].split(' ')[0]

    movie.type = d.split(' / ')[2].slice(0, 2)

    let evaluation = e('.star')
    movie.ratings = evaluation.find('span').text().slice(3)

    let pic = e('.pic')

    let ranking = pic.find('em').text()
    movie.ranking = Number(ranking)

    movie.coverUrl = pic.find('img').attr('src')

    let other = e('.other').text()
    movie.otherNames = other.slice(3).split('  /  ').join('/')

    return movie
}


const ensurePath = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

const cachedUrl = (url) => {
    let directory = 'cached_html'
    ensurePath(directory)

    let cacheFile = directory + '/' + url.split('?')[1] + '.html'

    let exists = fs.existsSync(cacheFile)
    if (exists) {
        let data = fs.readFileSync(cacheFile)
        return data
    } else {
        let r = request.get.sync(url)
        let body = r.body
        fs.writeFileSync(cacheFile, body)
        return body
    }
}

const moviesFromUrl = (url) => {
    let body = cachedUrl(url)
    let e = cheerio.load(body)

    let movieDivs = e('.item')
    let movies = []
    for (let i = 0; i < movieDivs.length; i++) {
        let div = movieDivs[i]
        log('div==', div, typeof div)
        let m = movieFromDiv(div)
        movies.push(m)
    }
    return movies
}

const saveMovies = (movies) => {
    let s = JSON.stringify(movies, null, 2)
    let path = 'douban.json'
    fs.writeFileSync(path, s)
}

const downloadCovers = (movies) => {
    let coverPath = 'covers'
    ensurePath(coverPath)
    const request = require('request')
    for (let i = 0; i < movies.length; i++) {
        let m = movies[i]
        let url = m.coverUrl
        let ranking = m.ranking
        let name = m.name.split(' / ')[0]
        let path = `${coverPath}/${ranking}_${name}.jpg`
        log('cover path', path)
        request(url).pipe(fs.createWriteStream(path))
    }
}

const __main = () => {
    let movies = []
    for (let i = 0; i < 10; i++) {
        let start = i * 25
        let url = `https://movie.douban.com/top250?start=${start}&filter=`
        let moviesInPage = moviesFromUrl(url)

        movies = [...movies, ...moviesInPage]
    }
    saveMovies(movies)
    downloadCovers(movies)
    log('抓取成功, 数据已经写入到 douban.json 中')
}

__main()
