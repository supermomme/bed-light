// automation-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const automation = new Schema({
    deviceId: { type: Schema.Types.ObjectId, required: true }, // device for automation
    patch: { type: Schema.Types.Mixed, required: true }, // patch data (dot notation)
    triggers: [] // different triggers noraml crontab/job ; if '@' then special e.g. '@start' (trigger when feathers starts)
  }, {
    timestamps: true,
    minimize: false
  })

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('automation')
  } catch (e) {
    return mongooseClient.model('automation', automation)
  }
}
