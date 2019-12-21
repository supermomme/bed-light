// integration-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const integrationClasses = require('../../integration')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const integration = new Schema({
    type: { type: String, required: true, enum: Object.keys(integrationClasses), immutable: true },
    config: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, default: 'UNKNOWN'},
    statusMessage: { type: String, default: 'Status is unkown' }
  }, {
    timestamps: true,
    minimize: false
  })

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('integration')
  } catch (e) {
    return mongooseClient.model('integration', integration)
  }
}
