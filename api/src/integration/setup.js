const logger = require('../logger')
const availableIntegration = [
  'espMomme'
]

module.exports = function (app) {
  (async function(){
    app.$integration = {}
    let integration = (await app.service('integration').find()).data
    for (let i = 0; i < integration.length; i++) {
      if (availableIntegration.indexOf(integration[i].type) !== -1) {
        const Integration = require(`./${integration[i].type}`)
        app.$integration[integration[i]._id] = new Integration(integration[i]._id, app)
      }
    }
    logger.info('Integration Setup')
  })()
    .catch(error => console.error(error))

  // setInterval(() => {
  //   console.log(Object.keys(app.$integration))
  // }, 1000)
}
