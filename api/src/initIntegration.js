const logger = require('./logger')
const integrationClasses = require('./integration')

module.exports = function (app) {
  (async function(){
    if (app.$integration) {
      // call destroy to all integration
      for (const id in app.$integration) {
        app.$integration[id].destroy()
      }
    }
    app.$integration = {}
    let integration = (await app.service('integration').find()).data
    for (let i = 0; i < integration.length; i++) {
      if (integrationClasses[integration[i].type] != undefined) {
        // eslint-disable-next-line require-atomic-updates
        app.$integration[integration[i]._id] = new integrationClasses[integration[i].type](integration[i]._id, app)
      }
    }
    logger.info('Integration-class Initialized')
  })()
    .catch(error => console.error(error))

  // setInterval(() => {
  //   console.log(Object.keys(app.$integration))
  // }, 1000)
}
