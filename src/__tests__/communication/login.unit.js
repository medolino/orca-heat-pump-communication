describe('Communication - login unit tests', () => {
  it('should make login request and return response', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation(() => {
      const mockResponse = 'response code\nresponse msg\ncookie=123456'

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(mockResponse))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    const response = await communication.login()

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://lorem.test/cgi/login?username=user&password=pass')

    const expectedResponse = {
      code: 'response code',
      message: 'response msg',
      cookie: 'cookie=123456'
    }

    expect(response).toEqual(expectedResponse)
  })

  it('should prepend http:// to host when not provided', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation(() => {
      const mockResponse = 'response code\nresponse msg\ncookie=123456'

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(mockResponse))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('localhost', 'user', 'pass')

    const response = await communication.login()

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://localhost/cgi/login?username=user&password=pass')

    const expectedResponse = {
      code: 'response code',
      message: 'response msg',
      cookie: 'cookie=123456'
    }

    expect(response).toEqual(expectedResponse)
  })

  it('should not include cookie when not provided', async () => {
    jest.mock('node-fetch')

    const fetch = require('node-fetch')

    fetch.mockImplementation(() => {
      const mockResponse = 'response code\nresponse msg'

      const textMock = jest.fn().mockImplementation(() => Promise.resolve(mockResponse))

      return Promise.resolve({
        text: textMock
      })
    })

    const Communication = require('../../communication')

    const communication = Communication('http://lorem.test', 'user', 'pass')

    const response = await communication.login()

    const expectedResponse = {
      code: 'response code',
      message: 'response msg'
    }

    expect(response).toEqual(expectedResponse)
  })
})
