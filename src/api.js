import axios from 'axios'
import {getCollection} from './eveQuery'
import readConfigFile from './configApi'

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

let capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let obj = {}
readConfigFile().then((urls) => {
    let allMethods = ['GET', 'POST', 'PUT', 'DELETE']
    for (let config of urls) {
        let methods = 'methods' in config ? config.methods : allMethods
        for (let method of methods) {
            if (method === 'GET' && config.type === 'eve') {
                let methodName = method.toLowerCase() + capitalize(config.url)
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
})

export default obj