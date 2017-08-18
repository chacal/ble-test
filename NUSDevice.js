const NobleDevice = require('noble-device')
const events = require('events')
const util = require('util')

const NRFUART_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e'
const NRFUART_RX_CHAR      = '6e400003b5a3f393e0a9e50e24dcca9e'
const NRFUART_TX_CHAR      = '6e400002b5a3f393e0a9e50e24dcca9e'


const NUSDevice = function(peripheral) {
  NobleDevice.call(this, peripheral)
}

util.inherits(NUSDevice, events.EventEmitter)
NobleDevice.Util.inherits(NUSDevice, NobleDevice)
NUSDevice.SCAN_UUIDS = [NRFUART_SERVICE_UUID]


NUSDevice.prototype.connectAndSetup = function(callback) {
  const self = this

  NobleDevice.prototype.connectAndSetup.call(self, function() {
    self.notifyCharacteristic(NRFUART_SERVICE_UUID, NRFUART_RX_CHAR, true, data => self.emit("data", data), callback)
  })
}


NUSDevice.prototype.write = function(data, done) {
  if (typeof data === 'string') {
    this.writeDataCharacteristic(NRFUART_SERVICE_UUID, NRFUART_TX_CHAR, new Buffer(data), done)
  } else {
    this.writeDataCharacteristic(NRFUART_SERVICE_UUID, NRFUART_TX_CHAR, data, done)
  }
}



module.exports = NUSDevice
