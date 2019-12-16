// gadget-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const gadget = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    
    senderType: { type: String, required: true, enum: [
      'UDP'
      // more coming
    ] },
    senderConfig: { type: Schema.Types.Mixed }, // ip, port, token, etc

    backendType: { type: String, default: 'MATRIX', uppercase: true, enum: [
      'MATRIX',
      // comming soon: 'LIGHT_SWITCH'
    ] },
    backendConfig: { type: Schema.Types.Mixed, default: {} }, // config like width, height of matrix
    backendState: { type: Schema.Types.Mixed, default: {} }, // Modes state or wathever
    
    enabled: { type: Boolean, default: true },
  }, {
    timestamps: true,
    minimize: false
  })

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('gadget')
  } catch (e) {
    return mongooseClient.model('gadget', gadget)
  }
}
