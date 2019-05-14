import axios from 'axios'

let instance = axios.create({
    baseURL: 'localhost:8000',
    headers: {
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
    }
})

let urls = [
    {
        'url': 'user',
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