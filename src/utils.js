const arrayDiff = (checkArray, compareArray) =>
  checkArray.filter(item => !compareArray.includes(item))

const isObject = value =>
  !!value && typeof value === 'object' &&
  value.constructor === Object

const generateUrl = (host, path, queryParams = {}) => {
  if (typeof path === 'undefined') {
    path = ''
  }

  // remove slash from host, if provided at the end
  if (host.charAt(host.length - 1) === '/') {
    host = host.slice(0, -1)
  }

  // remove slash from path, if provided at the beginning
  const urlPath = path && path.charAt(0) !== '/' ? `/${path}` : path

  const queryArray = Object.entries(queryParams)
    .map(([paramName, paramValue]) => `${paramName}=${paramValue}`)

  const urlQuery = queryArray.length ? `?${queryArray.join('&')}` : ''

  return `${host}${urlPath}${urlQuery}`
}

/**
 * Get type of provided data.
 *
 * @param  {*} data - data value
 * @return {String} Returns data type
 */
const getDataType = data => {
  // number, string, boolean, symbol, undefined, function
  let dataType = typeof data

  switch (dataType) {
    case 'number':
      dataType = isNaN(data) ? 'nan' : 'number'
      break

    case 'object':
      if (Array.isArray(data)) {
        dataType = 'array'
      } else if (data === null) {
        dataType = 'null'
      } else if (data.constructor) {
        dataType = data.constructor.name.toLowerCase()
      } else {
        dataType = 'object'
      }

      break
  }

  return dataType
}

module.exports = {
  arrayDiff,
  isObject,
  generateUrl,
  getDataType
}
