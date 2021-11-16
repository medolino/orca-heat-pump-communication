const { generateUrl } = require('../../utils')

describe('Utils - generateUrl unit tests', () => {
  it('should generate url for provided values', () => {
    const values = [
      {
        args: {
          host: 'http://localhost',
          path: '/path',
          queryParams: { page: 1, limit: 100 }
        },
        url: 'http://localhost/path?page=1&limit=100'
      },
      {
        args: {
          host: 'http://localhost/',
          path: '/path',
          queryParams: { page: 1, limit: 100 }
        },
        url: 'http://localhost/path?page=1&limit=100'
      },
      {
        args: {
          host: 'http://localhost/',
          path: 'path',
          queryParams: { page: 1, limit: 100 }
        },
        url: 'http://localhost/path?page=1&limit=100'
      },
      {
        args: {
          host: 'http://localhost/',
          path: 'path',
          queryParams: { page: 1 }
        },
        url: 'http://localhost/path?page=1'
      },
      {
        args: {
          host: 'http://localhost/',
          path: 'path',
          queryParams: {}
        },
        url: 'http://localhost/path'
      },
      {
        args: {
          host: 'http://localhost/',
          path: 'path'
        },
        url: 'http://localhost/path'
      },
      {
        args: {
          host: 'http://localhost/'
        },
        url: 'http://localhost'
      },
      {
        args: {
          host: 'http://localhost/',
          queryParams: { page: 1, limit: 100 }
        },
        url: 'http://localhost?page=1&limit=100'
      }
    ]

    for (const { args: { host, path, queryParams }, url } of values) {
      const generatedUrl = generateUrl(host, path, queryParams)
      expect(generatedUrl).toEqual(url)
    }
  })
})
