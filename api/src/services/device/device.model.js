// device-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const device = new Schema({
    integrationId: { type: Schema.Types.ObjectId, required: true }, // should only be writte by integration-class
    deviceName: { type: String, required: true, immutable: true, unique: true }, // should never be overwritten
    type: { type: String, required: true }, // should only be writte by integration-class
    state: { type: Schema.Types.Mixed, default: {} }, // can be overwritten by enduser
    config: { type: Schema.Types.Mixed, default: {} }, // should only be writte by integration-class
    setting: { type: Schema.Types.Mixed, default: {} }, // can be overwritte by enduser
    status: { type: String, default: 'UNKNOWN'}, // should only be writte by integration-class
    statusMessage: { type: String, default: 'Status is unkown' } // should only be writte by integration-class
  }, {
    timestamps: true,
    minimize: false
  })

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('device')
  } catch (e) {
    return mongooseClient.model('device', device)
  }
}
