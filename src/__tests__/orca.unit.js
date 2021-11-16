const Orca = require('../')

describe('Orca - unit tests', () => {
  it('should return read and write tag funciton', async () => {
    const settings = {
      username: 'user',
      password: 'pass',
      host: 'http://192.168.1.100'
    }

    const orca = Orca(settings)

    expect(orca).toBeInstanceOf(Object)

    const expectedRes = {
      readTags: expect.any(Function),
      writeTags: expect.any(Function)
    }

    expect(orca).toEqual(expectedRes)
  })

  it('should throw error when provided settings is not object or missing', async () => {
    const invalidSettings = [
      undefined,
      [],
      'test',
      '',
      0,
      1,
      true,
      false,
      new Date(),
      new Set()
    ]

    for (const settings of invalidSettings) {
      expect(() => Orca(settings))
        .toThrow('Settings in form of object with following properties should be provided: username, password, host')
    }
  })

  it('should throw error when missing required settings', async () => {
    const invalidSettings = [
      { value: {}, error: 'Missing required settings: username, password, host' },
      { value: { host: 'host' }, error: 'Missing required settings: username, password' },
      { value: { username: 'user' }, error: 'Missing required settings: password, host' },
      { value: { password: 'pass' }, error: 'Missing required settings: username, host' },
      { value: { host: 'host', username: 'user' }, error: 'Missing required settings: password' },
      { value: { host: 'host', password: 'pass' }, error: 'Missing required settings: username' },
      { value: { username: 'user', password: 'pass' }, error: 'Missing required settings: host' }
    ]

    for (const { value, error } of invalidSettings) {
      expect(() => Orca(value)).toThrow(error)
    }
  })
})
