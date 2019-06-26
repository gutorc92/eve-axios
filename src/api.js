import axios from 'axios'
import {getCollection} from './eveQuery'
import {ApiConfig} from './configApi'



export class Api {
    constructor (defaultConfig) {
        this.urls = 'urls' in defaultConfig ? defaultConfig.urls : []
        delete defaultConfig['urls']
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
                } else if (config.isEvePost(method)) {
                    this[methodName] = async (payload, email = '', extraheaders = {}) => {
                        let headers = Object.assign(extraheaders)
                        if (email) {
                            headers['UserEmail'] = email
                        }
                        return await this.instance.post(`/${config.url}`, payload, { headers: headers })
                    }
                }
            }
        }
    }
}