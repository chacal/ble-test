const NUSDevice = require('./NUSDevice')

console.log('Scanning for devices..')

NUSDevice.discoverAsync()
  .tap(nusDevice => {
    console.log('Discovered NUS device:', nusDevice._peripheral.advertisement.localName)
    nusDevice.on('disconnect', () => console.log('Disconnected!'))
  })
  .then(nusDevice => nusDevice.connectAndSetupAsync())
  .tap(() => console.log('Connected'))
  .then(nusDevice => {
    nusDevice.rx.onValue(data => console.log('Received data:', data.toString()))

    var writeCount = 0
    setInterval(() => {
      const TEST_DATA = 'Hello world! ' + writeCount++
      nusDevice.writeAsync(TEST_DATA)
        .then(() => console.log('data sent:', TEST_DATA))
    }, 3000)
  })
  .catch(e => console.log('ERROR', e))
