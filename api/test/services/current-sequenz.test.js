const assert = require('assert');
const app = require('../../src/app');

describe('\'current-sequenz\' service', () => {
  it('registered the service', () => {
    const service = app.service('current-sequenz');

    assert.ok(service, 'Registered the service');
  });
});
