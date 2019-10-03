import QueryBuilder from './mongoBuilder'
import isEmpty from 'lodash.isempty'


let buildQuery = (where) => {
    let query = '{}'
    if (!isEmpty(where)) {
        query = QueryBuilder(where)
    }
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
        if (typeof sort === 'object') {
            let fields = []
            for (let key of Object.keys(sort)) {
                fields.push(`("${key}", ${sort[key]})`)
            }
            sort = fields.join('')
        }
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

let getAggregate = ({ url, aggregate = {}}) => {
    let query = ''
    let whereCompiled = buildQuery(aggregate)
    query = `/${url}?aggregate=${whereCompiled}`
    return query
}

export {getAggregate, getCollection}