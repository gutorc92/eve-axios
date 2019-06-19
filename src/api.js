import axios from 'axios'
import {getCollection} from './eveQuery'
import {ApiConfig} from './configApi'

let instance = axios.create({
    baseURL: process.env.API || process.env.API_DEV_URL,
    headers: {
        'Cache-Control': 'no-cache'
    },
    auth: {
        username: process.env.USER_API || 'admin',
        password: process.env.PASS || 'admin'
    },
    timeout: 1500
})


export class Api {
    constructor (urls = {}) {
        this.urls = urls
        this.build()
    }
    build () {
        for (let conf of this.urls) {
            let config = new ApiConfig(conf)
            for (let method of config.methods) {
                let methodName = config.methodName(method)
                if (config.isEveGet(method)) {
                    this[methodName] = async ({where = {}, page = 1, max = 150, sort = '', headers = {}, embedded = '{}', projection = false }) => {
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
                            return await instance.get(url,  { headers: headers })
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
                        return await instance.post(`/${config.url}`, payload, { headers: headers })
                    }
                }
            }
        }
    }
}