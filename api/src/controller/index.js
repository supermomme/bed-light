const logger = require('../logger')
const GadgetController = require('./GadgetController')

let gadgetClasses = []

module.exports = function (app) {
  (async function(){

    let gadgets = (await app.service('gadget').find()).data
    for (let i = 0; i < gadgets.length; i++) {
      gadgetClasses.push(new GadgetController(gadgets[i]._id, app))
    }
    app.service('gadget').on('created', gadget => {
      gadgetClasses.push(new GadgetController(gadget._id, app))
    })
    app.service('gadget').on('removed', gadget => {
      let i = gadgetClasses.findIndex(val => gadget._id === val.id)
      if (i !== -1) {
        gadgetClasses.destroy()
      }
      console.log(gadgetClasses)

      gadgetClasses = gadgetClasses.filter(val => gadget._id !== val.id)
      console.log(gadgetClasses)

    })

    logger.info('Controller Started')
  })()
    .catch(error => console.error(error))
}
