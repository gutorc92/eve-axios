import axios from 'axios'
import {getCollection} from './eveQuery'
import {readConfigFile, ApiConfig} from './configApi'

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



let obj = {}
readConfigFile().then((urls) => {
    
    for (let config of urls) {
        let objConfig = new ApiConfig(config)
        for (let method of objConfig.methods) {
            let methodName = objConfig.methodName(method)
            if (objConfig.isEveGet(method)) {
                obj[methodName] = async ({where = {}, page = 1, max = 150, sort = '', headers = {}, embedded = '{}', projection = false }) => {
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
            } else if (objConfig.isEvePost(method)) {
                obj[methodName] = async (payload, email = '', extraheaders = {}) => {
                    let headers = Object.assign(extraheaders)
                    if (email) {
                        headers['UserEmail'] = email
                    }
                    return await instance.post(`/${config.url}`, payload, { headers: headers })
                }
            }
        }
    }
})

export default obj