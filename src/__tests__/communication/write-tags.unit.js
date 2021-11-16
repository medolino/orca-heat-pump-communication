describe('Communication - writeTags unit tests', () => {
  it('should make send writeTags request and return parsed response when cookie exists', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation((url) => {
      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass':
          response = 'response code\nresponse msg\ncookie=123456'
          break
        case 'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57':
          response = '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t57'
          break
      }

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(response))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    const { cookie } = await communication.login()

    const requestValues = [
      { name: '2_Temp_prostor_dnevna', value: 22.5 },
      { name: '2_Temp_Zunanja', value: 5.7 }
    ]

    const response = await communication.writeTags(requestValues)

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_Temp_Zunanja', status: 'S_OK', value: 5.7 }
    ]

    expect(response).toEqual(expectedResponse)

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57',
      { headers: { cookie } }
    )
  })

  it('should convert float, integer and boolean before sending', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation((url) => {
      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass':
          response = 'response code\nresponse msg\ncookie=123456'
          break
        case 'http://lorem.test/cgi/writeTags?n=4&t1=2_Temp_prostor_dnevna&v1=225&t2=2_PogojPGDT_N_OSN_ON_SV&v2=0&t3=2_PogojPGDT_N_OSN_ON_OK1&v3=1&t4=2_CURRENT_HOUR&v4=22':
          response = '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_PogojPGDT_N_OSN_ON_SV\tS_OK\n192\t0\n#2_PogojPGDT_N_OSN_ON_OK1\tS_OK\n192\t1\n#2_CURRENT_HOUR\tS_OK\n192\t22'
          break
      }

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(response))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    const requestValues = [
      { name: '2_Temp_prostor_dnevna', value: 22.5 },
      { name: '2_PogojPGDT_N_OSN_ON_SV', value: false },
      { name: '2_PogojPGDT_N_OSN_ON_OK1', value: true },
      { name: '2_CURRENT_HOUR', value: 22 }
    ]

    const response = await communication.writeTags(requestValues)

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_PogojPGDT_N_OSN_ON_SV', status: 'S_OK', value: false },
      { tag: '2_PogojPGDT_N_OSN_ON_OK1', status: 'S_OK', value: true },
      { tag: '2_CURRENT_HOUR', status: 'S_OK', value: 22 }
    ]

    expect(response).toEqual(expectedResponse)
  })

  it('should make login before sending request, if not already logged in', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    let loginIsCalled = false

    fetch.mockImplementation((url) => {
      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass':
          response = 'response code\nresponse msg\ncookie=123456'
          loginIsCalled = true
          break
        case 'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57':
          response = !loginIsCalled
            ? '#E_NEED_LOGIN\n' // return failed login when login has not been called yet
            : '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t57'
          break
      }

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(response))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    // ensure login has not been called
    expect(fetch).toHaveBeenCalledTimes(0)

    const requestValues = [
      { name: '2_Temp_prostor_dnevna', value: 22.5 },
      { name: '2_Temp_Zunanja', value: 5.7 }
    ]

    const response = await communication.writeTags(requestValues)

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_Temp_Zunanja', status: 'S_OK', value: 5.7 }
    ]

    expect(response).toEqual(expectedResponse)

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57',
      { headers: { cookie: 'cookie=123456' } }
    )
  })

  it('should make login and send another request, when cookie does not exist or is expired', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    let loginRequestCount = 0

    fetch.mockImplementation((url, options) => {
      const { headers } = options || {}

      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass': {
          // simulate expired token
          const reqCookie = loginRequestCount === 0 ? 'expired' : 'valid'

          response = `response code\nresponse msg\ncookie=${reqCookie}`

          loginRequestCount++
        }
          break
        case 'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57':
          response = !headers || !headers.cookie || headers.cookie === 'cookie=expired'
            ? '#E_NEED_LOGIN\n'
            : '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t57'
          break
      }

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(response))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    // ensure login has not been called
    expect(fetch).toHaveBeenCalledTimes(0)

    const requestValues = [
      { name: '2_Temp_prostor_dnevna', value: 22.5 },
      { name: '2_Temp_Zunanja', value: 5.7 }
    ]

    const response = await communication.writeTags(requestValues)

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_Temp_Zunanja', status: 'S_OK', value: 5.7 }
    ]

    expect(response).toEqual(expectedResponse)

    expect(fetch).toHaveBeenCalledTimes(4)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57',
      { headers: { cookie: 'cookie=expired' } }
    )
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      4,
      'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57',
      { headers: { cookie: 'cookie=valid' } }
    )
  })

  it('should throw error when not able to log in after retry', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation((url) => {
      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass':
          response = 'error code\nerror msg'
          break
        case 'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57':
          response = '#E_NEED_LOGIN\n' // simulate expired token
          break
      }

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(response))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    // ensure login has not been called
    expect(fetch).toHaveBeenCalledTimes(0)

    const requestValues = [
      { name: '2_Temp_prostor_dnevna', value: 22.5 },
      { name: '2_Temp_Zunanja', value: 5.7 }
    ]

    await expect(() => communication.writeTags(requestValues))
      .rejects
      .toThrow('Failed to login: error code - error msg')

    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57',
      { headers: { cookie: null } }
    )
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
  })

  it('should throw error when invalid request values provided', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    let loginIsCalled = false

    fetch.mockImplementation((url) => {
      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass':
          response = 'response code\nresponse msg\ncookie=123456'
          loginIsCalled = true
          break
        case 'http://lorem.test/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57':
          response = !loginIsCalled
            ? '#E_NEED_LOGIN\n' // return failed login when login has not been called yet
            : '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t57'
          break
      }

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(response))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    // ensure login has not been called
    expect(fetch).toHaveBeenCalledTimes(0)

    const invalidRequests = [
      { value: 'test', error: 'Tags in form of array should be provided' },
      { value: false, error: 'Tags in form of array should be provided' },
      { value: Date(), error: 'Tags in form of array should be provided' },
      {
        value: { name: '2_Temp_prostor_dnevna', value: 22.5 },
        error: 'Tags in form of array should be provided'
      },
      {
        value: [{ tag: '2_Temp_prostor_dnevna', value: 22.5 }],
        error: 'Tag name and value should be provided'
      },
      {
        value: [123],
        error: 'Provided tag should be of type String or Object'
      }
    ]

    for (const { value, error } of invalidRequests) {
      debugger
      await expect(() => communication.writeTags(value))
        .rejects
        .toThrow(error)
    }
  })

  it('should throw error, when invalid value type provided', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation((url) => {
      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass':
          response = 'response code\nresponse msg\ncookie=123456'
          break
      }

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(response))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    const invalidValues = [
      {
        value: [{ name: '2_Temp_prostor_dnevna', value: 'tests' }],
        error: 'Provided value for tag "2_Temp_prostor_dnevna" should be of type number.'
      },
      {
        value: [{ name: '2_CURRENT_HOUR', value: 'test' }],
        error: 'Provided value for tag "2_CURRENT_HOUR" should be of type number.'
      },
      {
        value: [{ name: '2_PogojPGDT_N_OSN_ON_SV', value: 'test' }],
        error: 'Provided value for tag "2_PogojPGDT_N_OSN_ON_SV" should be of type boolean.'
      }
    ]

    for (const { value, error } of invalidValues) {
      await expect(() => communication.writeTags(value))
        .rejects
        .toThrow(error)
    }
  })
})
