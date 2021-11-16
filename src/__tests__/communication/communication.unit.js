const Communication = require('../../communication')

describe('Communication - unit tests', () => {
  it('should return object with communication functions', () => {
    const communication = Communication('host', 'username', 'password')

    const expectedResult = {
      login: expect.any(Function),
      readTags: expect.any(Function),
      writeTags: expect.any(Function)
    }

    expect(communication).toEqual(expectedResult)
  })
})
