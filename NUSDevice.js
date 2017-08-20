const Bluebird = require('bluebird')
const Bacon = require('baconjs')
const NobleDevice = require('noble-device')
const events = require('events')
const util = require('util')

const NRFUART_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e'
const NRFUART_RX_CHAR      = '6e400003b5a3f393e0a9e50e24dcca9e'
const NRFUART_TX_CHAR      = '6e400002b5a3f393e0a9e50e24dcca9e'


const NUSDevice = function(peripheral) {
  NobleDevice.call(this, peripheral)
  this.rx = Bacon.fromEvent(this, 'data')
}

util.inherits(NUSDevice, events.EventEmitter)
NobleDevice.Util.inherits(NUSDevice, NobleDevice)
NUSDevice.SCAN_UUIDS = [NRFUART_SERVICE_UUID]

NUSDevice.discoverAsync = () => new Bluebird(NUSDevice.discover)

NUSDevice.prototype.connectAndSetupAsync = function() {
  return Bluebird.fromCallback(callback => this.connectAndSetup(() => {
      this.notifyCharacteristic(NRFUART_SERVICE_UUID, NRFUART_RX_CHAR, true, data => this.emit("data", data), callback)
    })
  )
  .then(() => this)
}

NUSDevice.prototype.writeAsync = function(data) {
  const buf = typeof data === 'string' ? new Buffer(data) : data
  return Bluebird.fromCallback(callback => this.writeDataCharacteristic(NRFUART_SERVICE_UUID, NRFUART_TX_CHAR, buf, callback))
}

module.exports = NUSDevice
