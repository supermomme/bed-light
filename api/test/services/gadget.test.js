const assert = require('assert')
const app = require('../../src/app')

describe('\'gadget\' service', () => {
  it('registered the service', () => {
    const service = app.service('gadget')

    assert.ok(service, 'Registered the service')
  })
})
