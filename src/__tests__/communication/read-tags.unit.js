describe('Communication - readTags unit tests', () => {
  it('should make send readTags request and return parsed response when cookie exists', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation((url) => {
      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass':
          response = 'response code\nresponse msg\ncookie=123456'
          break
        case 'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja':
          response = '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t60'
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

    const response = await communication.readTags(['2_Temp_prostor_dnevna', '2_Temp_Zunanja'])

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_Temp_Zunanja', status: 'S_OK', value: 6 }
    ]

    expect(response).toEqual(expectedResponse)

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja',
      { headers: { cookie } }
    )
  })

  it('should parse boolean, float, and integer values', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation((url) => {
      let response = null

      switch (url) {
        case 'http://lorem.test/cgi/login?username=user&password=pass':
          response = 'response code\nresponse msg\ncookie=123456'
          break
        case 'http://lorem.test/cgi/readTags?n=4&t1=2_Temp_prostor_dnevna&t2=2_PogojPGDT_N_OSN_ON_SV&t3=2_PogojPGDT_N_OSN_ON_OK1&t4=2_CURRENT_HOUR':
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

    const tags = [
      '2_Temp_prostor_dnevna',
      '2_PogojPGDT_N_OSN_ON_SV',
      '2_PogojPGDT_N_OSN_ON_OK1',
      '2_CURRENT_HOUR'
    ]

    const response = await communication.readTags(tags)

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
        case 'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja':
          response = !loginIsCalled
            ? '#E_NEED_LOGIN\n' // return failed login when login has not been called yet
            : '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t60'
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

    const response = await communication.readTags(['2_Temp_prostor_dnevna', '2_Temp_Zunanja'])

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_Temp_Zunanja', status: 'S_OK', value: 6 }
    ]

    expect(response).toEqual(expectedResponse)

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja',
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
        case 'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja':
          response = !headers || !headers.cookie || headers.cookie === 'cookie=expired'
            ? '#E_NEED_LOGIN\n'
            : '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t60'
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

    const response = await communication.readTags(['2_Temp_prostor_dnevna', '2_Temp_Zunanja'])

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_Temp_Zunanja', status: 'S_OK', value: 6 }
    ]

    expect(response).toEqual(expectedResponse)

    expect(fetch).toHaveBeenCalledTimes(4)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja',
      { headers: { cookie: 'cookie=expired' } }
    )
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      4,
      'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja',
      { headers: { cookie: 'cookie=valid' } }
    )
  })

  it('should return empty string, in case of empty response', async () => {
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

    const response = await communication.readTags([])

    expect(response).toEqual('')
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
        case 'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja':
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

    await expect(() => communication.readTags(['2_Temp_prostor_dnevna', '2_Temp_Zunanja']))
      .rejects
      .toThrow('Failed to login: error code - error msg')

    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://lorem.test/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja',
      { headers: { cookie: null } }
    )
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      'http://lorem.test/cgi/login?username=user&password=pass'
    )
  })
})
