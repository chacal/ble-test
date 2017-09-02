const Bluebird = require('bluebird')
const Bacon = require('baconjs')
const NobleDevice = require('noble-device')
const events = require('events')
const util = require('util')

const SERVICE_UUID      = '0f6e000190d549408bd338b3f27649a2'
const WRITE_CHAR_UUID   = '0f6e000290d549408bd338b3f27649a2'


const MarineDisplayDevice = function(peripheral) {
  NobleDevice.call(this, peripheral)
}

util.inherits(MarineDisplayDevice, events.EventEmitter)
NobleDevice.Util.inherits(MarineDisplayDevice, NobleDevice)
MarineDisplayDevice.SCAN_UUIDS = [SERVICE_UUID]

MarineDisplayDevice.discoverAsync = () => new Bluebird(MarineDisplayDevice.discover)

MarineDisplayDevice.prototype.connectAndSetupAsync = function() {
  return Bluebird.fromCallback(cb => this.connectAndSetup(cb))
    .then(() => this)
}

MarineDisplayDevice.prototype.writeAsync = function(data) {
  const buf = typeof data === 'string' ? new Buffer(data) : data
  return Bluebird.fromCallback(callback => this.writeDataCharacteristic(SERVICE_UUID, WRITE_CHAR_UUID, buf, callback))
}

MarineDisplayDevice.prototype.toString = function() {
 return `${this.address} (Name: ${this._peripheral.advertisement.localName}, UUID: ${this.uuid}, RSSI: ${this._peripheral.rssi})`
}

module.exports = MarineDisplayDevice
