const assert = require('assert')
const app = require('../../src/app')

describe('\'mode\' service', () => {
  it('registered the service', () => {
    const service = app.service('mode')

    assert.ok(service, 'Registered the service')
  })
})
