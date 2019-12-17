// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const availableIntegration = [
  'espMomme'
]

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (availableIntegration.indexOf(context.result.type) !== -1 && context.app.$integration[context.result._id] == undefined) {
      let Integration = require(`../../../integration/${context.result.type}`)
      context.app.$integration[context.result._id] = new Integration(context.result._id, context.app)
    } else if (context.app.$integration[context.result._id] != undefined) {
      // patch Integraiton
    }
    return context
  }
}
