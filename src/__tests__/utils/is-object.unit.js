const { isObject } = require('../../utils')

describe('Utils - isObject unit tests', () => {
  it('should return true, when provided value is a valid object', () => {
    const obj = {
      name: 'demo'
    }

    const values = [
      {},
      { a: 1 },
      new Object(),
      Object.create(obj)
    ]

    for (const value of values) {
      const validationRes = isObject(value)

      expect(validationRes).toBe(true)
    }
  })

  it('should return false, when provided value is not a valid object', () => {
    const values = [
      'demo text',
      1134430200000,
      true,
      new Date(),
      function () {},
      null,
      [],
      [1, 2, 3]
    ]

    for (const value of values) {
      const validationRes = isObject(value)

      expect(validationRes).toBe(false)
    }
  })
})
