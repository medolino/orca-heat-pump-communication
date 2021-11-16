const { arrayDiff } = require('../../utils')

describe('Utils - arrayDiff unit tests', () => {
  it('should return values from first array, not present in second', () => {
    const diff = arrayDiff([1, 2, 3], [2, 3])

    expect(diff).toEqual([1])
  })
})
