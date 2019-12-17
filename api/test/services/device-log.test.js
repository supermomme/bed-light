const assert = require('assert');
const app = require('../../src/app');

describe('\'device-log\' service', () => {
  it('registered the service', () => {
    const service = app.service('device-log');

    assert.ok(service, 'Registered the service');
  });
});
