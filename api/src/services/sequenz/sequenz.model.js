// sequenz-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const sequenz = new Schema({
    name: { type: String, required: true },
    sequenz: [[{
      red: { type: Number, default: 0, required: true, min: 0, max: 1 },
      green: { type: Number, default: 0, required: true, min: 0, max: 1 },
      blue: { type: Number, default: 0, required: true, min: 0, max: 1 },
      alpha: { type: Number, default: 0, required: true, min: 0, max: 1 }
    }]]

  }, {
    timestamps: true
  })

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('sequenz')
  } catch (e) {
    return mongooseClient.model('sequenz', sequenz)
  }
}
