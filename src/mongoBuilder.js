/**
* QueryBuilder - Parse query json object given into a query string
* @param {object} queryObject - Json to be converted to query string
* @return {string} - converted query string
*/
function QueryBuilder (queryObject) {
    queryObject = JSON.parse(JSON.stringify(queryObject))
    console.log('query object', queryObject.email)
    filterEmptyPropsFromJson(queryObject)
    let query = jsonToQueryString(queryObject)
    console.log('final query', query)
    return query
  }
  
  /**
  * filterJson - removes Json atributes that match checker Function
  * @param {object} json - json to be filtered
  * @return {object} - filtered object
  */
  const filterEmptyPropsFromJson = (json) => {
    for (let prop in json) {
      if (json.hasOwnProperty(prop)) {
        if (json[prop] === '' || json[prop] === null || json[prop] === undefined) {
          delete json[prop]
        } else {
          if (typeof json[prop] === 'object') { filterEmptyPropsFromJson(json[prop]) }
        }
      }
    }
  }
  
  /**
  * jsonToQueryString - Takes a javascript object and parses it to a mongo query string
  * @param {object} jsonObj - object to be converted to query string
  * @return {string} - parsed mongo query string
  */
  const jsonToQueryString = (jsonObj) => {
    return '{' + recursiveJSONParse('', '', jsonObj).replace(',', '') + '}'
  }
  
  /**
  * recursiveJSONParse - general parse method for jsons both nested and unested into mongo query strings
  * @param {string} path - path to current node
  * @param {string} nodName - current node name
  * @param {value} nodContent - current node content. Can be anything but null or undefined
  * @return {string} - returns current node's proper mongo query string
  */
  function recursiveJSONParse (path, nodName, nodContent) {
    let finalStr = ''
    path += (path.length > 0) ? '.' + nodName : nodName
    console.log('path', path)
    if (typeof nodContent !== 'object') {
      return ',%22' + path + '%22:' + putDoubleQuotesIfString(nodContent)
    }
  
    for (let prop in nodContent) {
      if (prop[0] === '$') return nonRecursiveJSONParse(path, nodContent)
      finalStr += recursiveJSONParse(path, prop, nodContent[prop])
    }
  
    return finalStr
  }
  
  /**
  * nonRecursiveJSONParse - particular parse method for objects with mongo
  * operator properties such as $gte
  * @param {string} path - path to current object
  * @param {object} jsonObj - json object with mongo operator props to be parsed
  * @return {string} - jsonObj's proper mongo query string
  */
  function nonRecursiveJSONParse (path, jsonObj) {
    let str = ':{'
  
    for (let prop in jsonObj) {
      str += ',%22' + prop + '%22:' + putDoubleQuotesIfString(jsonObj[prop])
    }
  
    return ',%22' + path + '%22' + str.replace(',', '') + '}'
  }
  
  /**
  * putDoubleQuotesIfString - Puts double quotes on given param if param is a string
  * else returns param itself
  * @param {value} param - param to be type checked and double quoted if it is a string
  * @return {value} - param's value if not a string or double quoted if param is a string
  */
  function putDoubleQuotesIfString (param) {
    if (typeof param === 'string') {
      return '%22' + param + '%22'
    }
    return param
  }
  
  export default QueryBuilder
  