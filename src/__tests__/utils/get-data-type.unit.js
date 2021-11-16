const { getDataType } = require('../../utils')

describe('Utils - getDataType unit tests', () => {
  it('should return number, when provided value is of type number', () => {
    const values = [
      -1,
      5,
      5.5
    ]

    for (const value of values) {
      const type = getDataType(value)

      expect(type).toBe('number')
    }
  })

  it('should return nan, when provided value is NaN', () => {
    const type = getDataType(NaN)

    expect(type).toBe('nan')
  })

  it('should return string, when provided value is of type string', () => {
    const values = [
      'test string value',
      'test',
      '10',
      '10.80',
      'true',
      'false'
    ]

    for (const value of values) {
      const type = getDataType(value)

      expect(type).toBe('string')
    }
  })

  it('should return boolean, when provided value is of type boolean', () => {
    const values = [
      true,
      false
    ]

    for (const value of values) {
      const type = getDataType(value)

      expect(type).toBe('boolean')
    }
  })

  it('should return null, when provided value is null', () => {
    const type = getDataType(null)

    expect(type).toBe('null')
  })

  it('should return array, when provided value is array', () => {
    const values = [
      [],
      [1, 2, 3],
      ['test']
    ]

    for (const value of values) {
      const type = getDataType(value)

      expect(type).toBe('array')
    }
  })

  it('should return object, when provided value is an object without constructor', () => {
    const objectWithoutConstructor = {}

    objectWithoutConstructor.constructor = null

    const type = getDataType(objectWithoutConstructor)

    expect(type).toBe('object')
  })

  it('should return constructor name, when provided value is an object', () => {
    const type = getDataType(new Date())

    expect(type).toBe('date')
  })
})
