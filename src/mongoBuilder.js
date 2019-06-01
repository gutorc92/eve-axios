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
      return ',"' + path + '":' + putDoubleQuotesIfString(nodContent)
    }
  
    for (let prop in nodContent) {
      // catch special mongo markers and treat them accordingly
      if (prop[0] === '$') return mongoSpecialMarker(path, nodContent)

      finalStr += recursiveJSONParse(path, prop, nodContent[prop])
    }
  
    return finalStr
  }
  
/**
* mongoSpecialMarker - handles different argument types that can come in
*   special mongo markers such as arrays
* @param {string} path - path to current object
* @param {object} jsonObj - json object with mongo operator props to be parsed
* @return {string} - jsonObj's proper mongo query string
*/
function mongoSpecialMarker (path, jsonObj) {
  let str = (path.length > 0) ? '{' : ''

  for (let prop in jsonObj) {
    let propType = typeof jsonObj[prop]

    if (propType === 'number' || propType === 'boolean') {
      str += ',"' + prop + '":' + jsonObj[prop]
    } else if (propType === 'string') {
      str += ',"' + prop + '":"' + jsonObj[prop] + '"'
    } else if (Array.isArray(jsonObj[prop])) {
      // Código que trata de argumentos arrays nos marcadores mongo
      str += ',"' + prop + '":' + handleArrayArgument(jsonObj[prop])
    } else if (propType === 'object') {
      str += ',"' + prop + '":' + jsonToQueryString(jsonObj[prop])
    } else {
      // str += ',"' + prop + '":' + putDoubleQuotesIfString(jsonObj[prop])
      throw new Error('Argumento inválido, cobertura [numbers, strings, arrays, objects, boolean]')
    }
  }

  return (path.length > 0)
    ? ',"' + path + '":' + str.replace(',', '') + '}'
    : ',' + str.replace(',', '')
}


/**
* handleArrayArgument - function to handle(parse) an array argument given onto
*   a mongo friendly query string
* @param {Array} arr - array to be parsed
* @returns {String} - mongo friendly query string parsed from array
*/
function handleArrayArgument(arr) {
  let result = '['
  for (let element of arr) {
    if (typeof element !== 'object') {
      result += ',' + putDoubleQuotesIfString(element)
      continue
    }
    result += ',' + jsonToQueryString(element)
  }
  result = result.replace(',', '') + ']'
  return result
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
      str += ',"' + prop + '":' + putDoubleQuotesIfString(jsonObj[prop])
    }
  
    return ',"' + path + '"' + str.replace(',', '') + '}'
  }
  
  /**
  * putDoubleQuotesIfString - Puts double quotes on given param if param is a string
  * else returns param itself
  * @param {value} param - param to be type checked and double quoted if it is a string
  * @return {value} - param's value if not a string or double quoted if param is a string
  */
  function putDoubleQuotesIfString (param) {
    if (typeof param === 'string') {
      return '"' + param + '"'
    }
    return param
  }
  
  export default QueryBuilder
  