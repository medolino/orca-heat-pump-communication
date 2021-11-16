const nock = require('nock')

const Orca = require('../')

describe('Orca - integration tests', () => {
  it('should send readTags request and return parsed response', async () => {
    nock('http://localhost')
      .get('/cgi/login?username=user&password=pass')
      .reply(200, 'response code\nresponse msg\ncookie=123456')

    nock('http://localhost')
      .get('/cgi/readTags?n=2&t1=2_Temp_prostor_dnevna&t2=2_Temp_Zunanja')
      .reply(200, '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t60')

    const settings = {
      username: 'user',
      password: 'pass',
      host: 'http://localhost'
    }

    const orca = Orca(settings)

    const tags = ['2_Temp_prostor_dnevna', '2_Temp_Zunanja']

    const response = await orca.readTags(tags)

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_Temp_Zunanja', status: 'S_OK', value: 6 }
    ]

    expect(response).toEqual(expectedResponse)
  })

  it('should send writeTags request and return parsed response', async () => {
    nock('http://localhost')
      .get('/cgi/login?username=user&password=pass')
      .reply(200, 'response code\nresponse msg\ncookie=123456')

    nock('http://localhost')
      .get('/cgi/writeTags?n=2&t1=2_Temp_prostor_dnevna&v1=225&t2=2_Temp_Zunanja&v2=57')
      .reply(200, '#2_Temp_prostor_dnevna\tS_OK\n192\t225\n#2_Temp_Zunanja\tS_OK\n192\t57')

    const settings = {
      username: 'user',
      password: 'pass',
      host: 'http://localhost'
    }

    const orca = Orca(settings)

    const requestValues = [
      { name: '2_Temp_prostor_dnevna', value: 22.5 },
      { name: '2_Temp_Zunanja', value: 5.7 }
    ]

    const response = await orca.writeTags(requestValues)

    const expectedResponse = [
      { tag: '2_Temp_prostor_dnevna', status: 'S_OK', value: 22.5 },
      { tag: '2_Temp_Zunanja', status: 'S_OK', value: 5.7 }
    ]

    expect(response).toEqual(expectedResponse)
  })

  afterAll(() => nock.restore())
})
