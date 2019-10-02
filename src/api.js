import axios from 'axios'
import {getCollection, getAggregate} from './eveQuery'
import {ApiConfig} from './configApi'



export class Api {
    constructor (defaultConfig) {
        this.urls = 'urls' in defaultConfig ? defaultConfig.urls : []
        delete defaultConfig['urls']
        this.auth = 'auth' in defaultConfig ? defaultConfig.auth : null
        this.interceptor = undefined
        this.instance = axios.create(defaultConfig)
        this.build()
    }
    build () {
        for (let conf of this.urls) {
            let config = new ApiConfig(conf)
            for (let method of config.methods) {
                let methodName = config.methodName(method)
                if (config.isEveGet(method)) {
                    let obj = {
                        where: {},
                        page: 1,
                        max: 150,
                        sort: '',
                        headers: {},
                        embedded: '{}',
                        projection: false 
                    }
                    if (config.hasParameters()) {
                        for(let parameter of config.parameters) {
                            obj[parameter] = ''
                        }
                    }
                    this[methodName] = async (obj) => {
                        try {
                            let url = config.getUrl(obj)
                            let parserUrl = getCollection({
                                url: url,
                                where: obj.where,
                                page: obj.page,
                                max: obj.max,
                                sort: obj.sort,
                                embedded: obj.embedded,
                                projection: obj.projection
                            })
                            return await this.instance.get(parserUrl,  { headers: obj.headers })
                        } catch (err) {
                            // console.log('error', err)
                            return err
                        }
                    }
                    if (config.hasByID()) {
                        this[config.methodNameById()] = async (parameters = {id: '', headers: {}}) => {
                          return this.instance.get(config.getUrlById(parameters),  { headers: parameters.headers })
                        }
                    }
                } else if (config.isEvePost(method)) {
                    this[methodName] = async (payload, email = '', extraheaders = {}) => {
                      let headers = Object.assign(extraheaders)
                      if (email) {
                          headers['UserEmail'] = email
                      }
                      return await this.instance.post(`/${config.url}`, payload, { headers: headers })
                    }
                } else if (config.isEveDelete(method)) {
                    this[methodName] = async ({id = undefined, etag = undefined, data = undefined, headers = {}} = {}) => {
                      let parserUrl = `${config.url}`
                      if (id !== undefined && etag !== undefined) {
                        parserUrl = `${config.url}/${id}`
                        headers['If-Match'] = etag
                      }
                      return this.instance.delete(parserUrl,  { headers: headers })
                    }
                } else if (config.isEvePatch(method)) {
                    this[methodName] = async ({id = undefined, etag = undefined, data = undefined, headers = {}} = {}) => {
                      let parserUrl = `${config.url}`
                      if (id !== undefined && etag !== undefined) {
                        parserUrl = `${config.url}/${id}`
                        headers['If-Match'] = etag
                      }
                      return this.instance.patch(parserUrl, data, { headers: headers })
                    }
                } else if (config.isEvePut(method)) {
                    this[methodName] = async ({id = undefined, etag = undefined, data = undefined, headers = {}} = {}) => {
                      let parserUrl = `${config.url}`
                      if (id !== undefined && etag !== undefined) {
                        parserUrl = `${config.url}/${id}`
                        headers['If-Match'] = etag
                      }
                      return this.instance.put(parserUrl, data,  { headers: headers })
                    }
                } else if (config.isAggregate(method)) {
                  let obj = {
                    aggregate: {},
                    headers: {},
                  }
                  if (config.hasParameters()) {
                      for(let parameter of config.parameters) {
                          obj[parameter] = ''
                      }
                  }
                  this[methodName] = async (obj) => {
                      try {
                          let url = config.getUrl(obj)
                          let parserUrl = getAggregate({
                              url: url,
                              aggregate: obj.aggregate
                          })
                          return await this.instance.get(parserUrl,  { headers: obj.headers })
                      } catch (err) {
                          // console.log('error', err)
                          return err
                      }
                  }
                }
            }
        }
    }

    addToken (token) {
      if (this.interceptor !== undefined) {
        this.instance.interceptors.request.eject(this.interceptor)
        this.interceptor = undefined
      }
      this.interceptor = this.instance.interceptors.request.use(function (config) {
        if (token) {
          config.auth = undefined
          if (config.headers === undefined || config.headers === null) {
            config.headers = {Authorization: ''}
          } else if (!('Authorization' in config.headers)){
            config.headers['Authorization'] = ''
          }
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      })
    }

    unsetToken() {
      let auth = this.auth
      if (this.interceptor !== undefined) {
        this.instance.interceptors.request.eject(this.interceptor)
        this.interceptor = undefined
      }
      this.interceptor = this.instance.interceptors.request.use(function (config) {
        if (auth) {
          if (config.headers === undefined || config.headers === null) {
            config.headers = {Authorization: ''}
          } else if (!('Authorization' in config.headers)){
            config.headers['Authorization'] = ''
          }
          const base64 = Buffer.from(auth.username + ':' + auth.password, 'utf8').toString('base64');
          config.headers.Authorization = `Basic ${base64}` 
          config.auth = auth
        }
        return config
      })
    }

    get (url, config) {
      return this.instance.get(url, config)
    }

    delete (url, config) {
      return this.instance.delete(url, config)
    }

    head (url, config) {
      return this.instance.head(url, config)
    }

    options (url, config) {
      return this.instance.options(url, config)
    }

    post (url, data,  config) {
      return this.instance.post(url, data,  config)
    }

    put (url, data,  config) {
      return this.instance.put(url, data,  config)
    }

    patch (url, data,  config) {
      return this.instance.patch(url, data,  config)
    }
}