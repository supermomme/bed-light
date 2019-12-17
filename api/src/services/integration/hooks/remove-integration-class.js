// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.app.$integration[context.result._id] != undefined) {
      context.app.$integration[context.result._id].destroy()
      delete context.app.$integration[context.result._id]
    }
    return context
  }
}
