import axios from 'axios'
import QueryBuilder from './mongoBuilder'
import isEmpty from 'lodash.isempty'

let instance = axios.create({
    baseURL: process.env.API || process.env.API_DEV_URL,
    headers: {
        'Cache-Control': 'no-cache'
    },
    auth: {
        username: process.env.USER || 'admin',
        password: process.env.PASS || 'admin'
    },
    timeout: 1500
})


let capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let buildQuery = (where) => {
    let query = '{}'
    if (!isEmpty(where)) {
        query = QueryBuilder(where)
    }
    console.log('query', query)
    return query
}

let getCollection  = ({ url, where = {}, page = 1, max = 150, sort = '', embedded = '{}', projection = false }) => {
    let query = ''
    let whereCompiled = buildQuery(where)
    query = `/${url}?where=${whereCompiled}&max_results=${max}`
    if (page >1) {
        query = query + `&page=${page}`
    }
    if (sort) {
        query = query + `&sort=[${sort}]`
    }
    if (embedded !== '{}') {
        query = query + `&embedded=${embedded}`
    }
    if (projection) {
      query = query + `&projection=${projection}`
    }
    return query
}

let getAggregate = ({ url, where = '{}', page = 1, max = 150, sort = '', embedded = '{}', projection = false }) => {
    let query = ''
    query = `/${url}?aggregate=${aggregate}&sort=[${sort}]&page=${page}&max_results=${max}&embedded=${embedded}`
    if (projection) {
      query = query + `&projection=${projection}`
    }
    return query
}

let urls = [
    {
        'url': 'user',
        'type': 'eve',
        'methods': ['GET']
    },
    {
        'url': 'questions',
        'type': 'eve',
        'methods': ['GET']
    }
]



let obj = {}
let allMethods = ['GET', 'POST', 'PUT', 'DELETE']
for (let config of urls) {
    let methods = 'methods' in config ? config.methods : allMethods
    for (let method of methods) {
        if (method === 'GET' && config.type === 'eve') {
            let methodName = method.toLowerCase() + capitalize(config.url)
            obj[methodName] = async ({where = {}, page = 1, max = 150, sort = '', headers = {}, embedded = '{}', projection = false }) => {
                console.log('where', where)
                try {
                    let url = getCollection({
                        url: config.url,
                        where,
                        page,
                        max,
                        sort,
                        embedded,
                        projection
                    })
                    console.log('url', url)
                    return await instance.get(url,  { headers: headers })
                } catch (err) {
                    // console.log('error', err)
                    return err
                }
            }
        }
    }
}

export default obj