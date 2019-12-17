const assert = require('assert');
const app = require('../../src/app');

describe('\'integration\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration');

    assert.ok(service, 'Registered the service');
  });
});
