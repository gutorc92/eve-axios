import fs from 'fs'
import path from 'path'
import replace from 'lodash.replace'
import camelCase from 'lodash.camelcase'
import includes from 'lodash.includes'

const ALLMETHODS = ['GET', 'POST', 'PUT', 'DELETE']

export class ApiConfig {
    constructor (config = {}) {
        this.url = 'url' in config ? config.url : ''
        this.type = 'type' in config ? config.type: ''
        this.methods = 'methods' in config ? config.methods : ALLMETHODS
    }
    hasMethod (method) {
        if (includes(this.methods, method)) {
            return true
        }
        return false
    }
    methodName (method) {
        return replace(camelCase(method.toLowerCase() + ' ' + replace(this.url, '/', ' ')), ' ', '')
    }
    isEveGet(method) {
        if (this.type === 'eve' && method === 'GET') {
            return true
        }
        return false
    }
    isEvePost (method) {
        return (this.type === 'eve' && method === 'POST')
    }
}

let readConfigFile = async () => {
    let fileName = 'configAxiosEve.json'
    let filePath = ''
    try {
        if (fs.existsSync(path.join(__dirname, fileName))) {
            filePath = path.join(__dirname, fileName)
        } else if (fs.existsSync(path.join(__dirname, '..', fileName))) {
            filePath = path.join(__dirname, '..', fileName)
        }
        console.log('path', filePath)
        let rawdata = fs.readFileSync(filePath, 'utf-8')  
        let config = JSON.parse(rawdata)
        return config
    } catch (e) {
        console.log('excption on read', e)
        return []
    }
}

export {readConfigFile}