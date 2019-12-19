// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.app.$integration[context.result.integrationId] != undefined) {
      context.app.$integration[context.result.integrationId].patchDeviceState(context.result._id, context.result.state)
    }
    return context
  }
}
