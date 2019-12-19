// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const logger = require('../../../logger')
const integrationClasses = require('../../../integration')

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (integrationClasses[context.result.type] == undefined) {
      context.app.$integration[context.result._id] = new integrationClasses[context.result.type](context.result._id, context.app)
    } else {
      logger.warn(`Class already exist! skip ${context.result.id}`)
    }
    return context
  }
}
