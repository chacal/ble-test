const NUSDevice = require('./NUSDevice')

console.log('Scanning for devices..')

NUSDevice.discover(function(nusDevice) {
  console.log('Discovered NUS device:', nusDevice._peripheral.advertisement.localName)

  nusDevice.on('disconnect', () => console.log('Disconnected!'))

  nusDevice.connectAndSetup(function() {
    nusDevice.readDeviceName(devName => console.log('Device name:', devName))

    nusDevice.on('data', data => console.log('Received data:', data.toString()))

    var writeCount = 0
    setInterval(() => {
      const TEST_DATA = 'Hello world! ' + writeCount++
      nusDevice.write(TEST_DATA, () => console.log('data sent:', TEST_DATA))
    }, 3000)
  })
})
