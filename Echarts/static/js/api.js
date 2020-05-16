const log = console.log.bind(console)

const api = {}

api.ajax = function (url, method, form, response) {
    let request = {
        url: url,
        type: method,
        contentType: 'application/json',
        success: function (r) {
            response(r);
        }
    }
    if (method === 'post') {
        let data = JSON.stringify(form);
        request.data = data
    }
    $.ajax(request)
}

api.get = function (url, response) {
    let method = 'get';
    let request = {
        url: url,
        type: method,
        contentType: 'application/json',
        success: function (r) {
            response(r);
        }
    }
    $.ajax(request)
}

api.fetchMovies = function(success) {
    let url = '/api/movie/all'
    this.get(url, success)
}
