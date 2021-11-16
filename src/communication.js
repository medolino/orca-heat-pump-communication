const fetch = require('node-fetch')

const { generateUrl, getDataType } = require('./utils')
const tags = require('./tags')

const tagActions = Object.freeze({
  READ: 'readTags',
  WRITE: 'writeTags'
})

const Communication = (host, username, password) => {
  let requestCookie = null

  const _parseValue = (tagName, sourceValue) => {
    const { props } = tags[tagName] || {}
    const { type } = props || {}

    let value = sourceValue

    switch (type) {
      case 'boolean':
        value = sourceValue === '1'
        break
      case 'float':
        value = parseFloat(`${sourceValue.slice(0, -1)}.${sourceValue.slice(-1)}`)
        break
      case 'integer':
        value = parseInt(sourceValue, 10)
        break
    }

    return value
  }

  const _parseResponse = (sourceResponse) => {
    const responseArray = sourceResponse
      .split('\n')
      .filter(value => value !== '')
      .map(value => value.split('\t'))
      .reduce((arr, val, ix) => {
        if (ix % 2) {
          // tag value
          const lastAddedTag = arr[arr.length - 1]
          const tagValue = _parseValue(lastAddedTag.tag, val[1])

          arr[arr.length - 1] = { ...lastAddedTag, value: tagValue }
        } else {
          // new tag
          arr.push({ tag: val[0].slice(1), status: val[1] })
        }

        return arr
      }, [])

    return responseArray
  }

  const _convertValueForSending = (tagName, sourceValue) => {
    const { props } = tags[tagName] || {}
    const { type } = props || {}

    let value = sourceValue

    switch (type) {
      case 'boolean':
        if (typeof sourceValue !== 'boolean') {
          throw new Error(`Provided value for tag "${tagName}" should be of type boolean.`)
        }

        value = Number(sourceValue)
        break
      case 'integer':
        if (typeof sourceValue !== 'number') {
          throw new Error(`Provided value for tag "${tagName}" should be of type number.`)
        }

        value = String(sourceValue)
        break
      case 'float':
        if (typeof sourceValue !== 'number') {
          throw new Error(`Provided value for tag "${tagName}" should be of type number.`)
        }

        value = String(sourceValue.toFixed(1)).replace('.', '')
        break
    }

    return value
  }

  const _buildQueryParams = (tags) => {
    const queryParams = tags.reduce((query, tag, ix) => {
      const tagType = getDataType(tag)
      const index = ix + 1

      switch (tagType) {
        case 'string':
          query[`t${index}`] = tag
          break
        case 'object':
          if (!tag.name || typeof tag.value === 'undefined') {
            throw new Error('Tag name and value should be provided')
          }

          query[`t${index}`] = tag.name
          query[`v${index}`] = _convertValueForSending(tag.name, tag.value)
          break
        default:
          throw new Error(`Provided tag should be of type String or Object, but "${tagType}" given`)
      }

      return query
    }, { n: tags.length })

    return queryParams
  }

  const login = async () => {
    const url = generateUrl(
      host,
      '/cgi/login',
      { username: username, password: password }
    )

    const response = await fetch(url)

    const body = await response.text()

    const [code, message, cookie] = body.split('\n')

    if (cookie) {
      requestCookie = cookie
    }

    return {
      code,
      message,
      ...cookie && { cookie }
    }
  }

  const _sendTagRequest = async (action, tags) => {
    if (!tags || !Array.isArray(tags)) {
      throw new Error('Tags in form of array should be provided')
    }

    // call login, when not logged in already
    if (!requestCookie) {
      await login()
    }

    const queryParams = _buildQueryParams(tags)

    const url = generateUrl(
      host,
      `/cgi/${action}`,
      queryParams
    )

    const headers = { cookie: requestCookie }

    const response = await fetch(url, { headers })

    const body = await response.text()

    // when cookie expires try to login again and repeat request
    if (body && body.startsWith('#E_NEED_LOGIN')) {
      const { code, message, cookie } = await login()

      if (!cookie) {
        throw new Error(`Failed to login: ${code} - ${message}`)
      }

      return _sendTagRequest(action, tags)
    }

    const parsedResponse = body ? _parseResponse(body) : ''

    return parsedResponse
  }

  return {
    login,
    readTags: (tags) => _sendTagRequest(tagActions.READ, tags),
    writeTags: (tags) => _sendTagRequest(tagActions.WRITE, tags)
  }
}

module.exports = Communication
