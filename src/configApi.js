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
        this.parameters = this.parametersList()
    }
    hasMethod (method) {
        if (includes(this.methods, method)) {
            return true
        }
        return false
    }
    hasParameters () {
        return this.parameters.length > 0
    }
    methodName (method) {
        let words = method.toLowerCase() + ' ' + this.url.split('/').join(' ')
        return camelCase(words)
    }
    parametersList () {
        const regex = /\{(.*?)\}/g
        let matches, output = []
        while (matches = regex.exec(this.url)) {
            output.push(matches[1]);
        }
        return output
    }
    getUrl (parameters = {}) {
        let url = this.url
        for(let parameter of this.parameters) {
            url = replace(url, `{${parameter}}`, `${parameters[parameter]}`)
        }
        return url
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