// device-log-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const deviceLog = new Schema({
    deviceId: { type: Schema.Types.ObjectId, required: true, immutable: true },
    state: { type: Schema.Types.Mixed, required: true, immutable: true }
  }, {
    timestamps: true
  })

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('deviceLog')
  } catch (e) {
    return mongooseClient.model('deviceLog', deviceLog)
  }
}
