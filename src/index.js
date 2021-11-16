const { arrayDiff, isObject } = require('./utils')
const Communication = require('./communication')

const REQUIRED_SETTINGS = [
  'username',
  'password',
  'host'
]

const Orca = (settings) => {
  if (!isObject(settings)) {
    throw new Error(`Settings in form of object with following properties should be provided: ${REQUIRED_SETTINGS.join(', ')}`)
  }

  const missingSettings = arrayDiff(REQUIRED_SETTINGS, Object.keys(settings))

  if (missingSettings.length) {
    throw new Error(`Missing required settings: ${missingSettings.join(', ')}`)
  }

  const { host, username, password } = settings

  const communication = Communication(host, username, password)

  return {
    readTags: communication.readTags,
    writeTags: communication.writeTags
  }
}

module.exports = Orca
