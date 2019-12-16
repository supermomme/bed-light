const UDPSender = require('./sender/UDP')
const MatrixBackend = require('./backend/Matrix')

module.exports = class GadgetController {
  constructor (id, app) {
    this.app = app
    this.id = id
    const service = this.app.service('gadget')
    
    this.patchHandlerFunction = message => this.patchHandler(message)
    service.on('patched', this.patchHandlerFunction)
    service.on('updated', this.patchHandlerFunction)

    service.get(this.id)
      .then(v => this.patchHandler(v))

    this.sender = null
    this.backend = null
    this.enabled = false
    this.interval = setInterval(() => this.update(), 1000)
  }

  initializeSender (type, config, enabled) {
    if (this.sender !== null) this.sender.destroy()
    this.sender = null
    if (type === 'UDP') this.sender = new UDPSender(config, enabled)
  }

  initializeBackend (type, state, config, enabled) {
    if (this.backend !== null) this.backend.destroy()
    this.backend = null
    if (type === 'MATRIX') this.backend = new MatrixBackend(state, config, enabled)
  }

  patchHandler (payload) {
    if (this.sender === null) this.initializeSender(
      payload.senderType,
      payload.senderConfig,
      payload.enabled
    )
    else {
      this.sender.setConfig(payload.senderConfig)
    }

    if (this.backend === null) this.initializeBackend(
      payload.backendType,
      payload.backendState,
      payload.backendConfig,
      payload.enabled
    )
    else {
      this.backend.setState(payload.state)
      this.backend.setEnabled(payload.enabled)
    }
    this.enabled = payload.enabled
  }

  update (sendAll = false) {
    if (!this.enabled) return
    let buffer = this.backend.getBuffer(sendAll)
    console.log(buffer.length)
    if (buffer.length > 0) this.sender.sendBuffer(buffer)
  }

  destroy () {
    const service = this.app.service('gadget')
    service.removeListener('patched', this.patchHandlerFunction)
    if (this.sender !== null) this.sender.destroy()
    if (this.backend !== null) this.backend.destroy()
  }
}