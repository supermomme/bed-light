const assert = require('assert');
const app = require('../../src/app');

describe('\'sequenz\' service', () => {
  it('registered the service', () => {
    const service = app.service('sequenz');

    assert.ok(service, 'Registered the service');
  });
});
