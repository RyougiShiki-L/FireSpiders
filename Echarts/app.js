const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use(express.static('static'))

const registerRoutes = function(app, routes) {
    for (let i = 0; i < routes.length; i++) {
        let route = routes[i]
        app[route.method](route.path, route.func)
    }
}

const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

const routeMovie = require('./route/movie')
registerRoutes(app, routeMovie.routes)

const main = () => {
    let host = 'localhost'
    let port = 8000
    let server = app.listen(port, host, function () {
        console.log(`应用实例，访问地址为 http://${host}:${port}`)
    })
}

if (require.main === module) {
    main()
}
