// device-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const device = new Schema({
    integrationId: { type: Schema.Types.ObjectId, required: true, immutable: true },
    state: { type: Schema.Types.Mixed, default: {} }
  }, {
    timestamps: true
  })

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('device')
  } catch (e) {
    return mongooseClient.model('device', device)
  }
}
