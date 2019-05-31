import axios from 'axios'

let instance = axios.create({
    baseURL: process.env.API || process.env.API_DEV_URL,
    headers: {
        'Cache-Control': 'no-cache'
    },
    auth: {
        username: process.env.USER || 'admin',
        password: process.env.PASS || 'admin'
    }
})

let urls = [
    {
        'url': 'user',
        'methods': ['GET']
    },
    {
        'url': 'questions',
        'methods': ['GET']
    }
]

let obj = {}
let allMethods = ['GET', 'POST', 'PUT', 'DELETE']
for (let config of urls) {
    let methods = 'methods' in config ? config.methods : allMethods
    for (let method of methods) {
        let methodName = method.toLowerCase() + config.url
        obj[methodName] = async () => {
            try {
                return await instance.get(config.url)
            } catch (err) {
                return err
            }
        }
    }
}

export default obj