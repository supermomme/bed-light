/* eslint-disable require-atomic-updates */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const deviceInfo = require('../../../integration/info')

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.method === 'find') {
      for (let i = 0; i < context.result.data.length; i++) {
        let integration = await context.app.service('integration').get(context.result.data[i].integrationId)
        if (deviceInfo[integration.type] != undefined) {
          context.result.data[i].frontendComponents = deviceInfo[integration.type].frontendComponents[context.result.data[i].type]
          context.result.data[i].settingComponents = deviceInfo[integration.type].settingComponents[context.result.data[i].type]
        }
      }
    } else {
      let integration = await context.app.service('integration').get(context.result.integrationId)
      if (deviceInfo[integration.type] != undefined) {
        context.result.frontendComponents = deviceInfo[integration.type].frontendComponents[context.result.type]
        context.result.settingComponents = deviceInfo[integration.type].settingComponents[context.result.type]
      }
    }
    
    return context
  }
}
