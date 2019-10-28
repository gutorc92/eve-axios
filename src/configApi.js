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
        this.method = 'method' in config ? config.method : null
        this.byID = 'byID' in config ? config.byID: true
        this.methods = 'methods' in config ? config.methods : ALLMETHODS
        this.parameters = this.parametersList()
    }
    nameSeted () {
      return this.method !== null
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
      if (this.type === 'eve/aggregate') {
        let words = method.toLowerCase() + ' ' + 'Ag' + ' ' + this.url.split('/').join(' ')
        return camelCase(words)
      } 
      let words = method.toLowerCase() + ' ' + this.url.split('/').join(' ')
      return camelCase(words)
    }
    methodNameById () {
        let words = 'get' + ' ' + this.url.split('/').join(' ') + ' ' + 'by' + ' ' + 'id'
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
    isEveDelete (method) {
        return (this.type === 'eve' && method === 'DELETE')
    }
    isEvePut (method) {
        return (this.type === 'eve' && method === 'PUT')
    }
    isEvePatch (method) {
        return (this.type === 'eve' && method === 'PATCH')
    }
    isAggregate (method) {
      return (this.type === 'eve/aggregate' && method === 'GET')
    }
    getUrlById (parameters = {}) {
        const parameter = 'id'
        let url = this.url + `/{${parameter}}`
        return replace(url, `{${parameter}}`, `${parameters[parameter]}`)
    }
    hasByID () {
        return this.byID
    }
    postFunction () {
      const url = this.url
      let postFunction = async (payload, email = '', extraheaders = {}) => {
        let headers = Object.assign(extraheaders)
        if (email) {
            headers['UserEmail'] = email
        }
        return await this.instance.post(`/${url}`, payload, { headers: headers })
      }
      return postFunction
    }

}