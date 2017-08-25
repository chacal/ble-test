const NUSDevice = require('./NUSDevice')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})


console.log('Scanning for devices..')

NUSDevice.discoverAsync()
  .tap(nusDevice => {
    console.log('Discovered NUS device:', nusDevice._peripheral.advertisement.localName)
    nusDevice.on('disconnect', () => console.log('Disconnected!'))
  })
  .then(nusDevice => nusDevice.connectAndSetupAsync())
  .tap(() => console.log('Connected'))
  .then(nusDevice => {
    rl.on('line', input => nusDevice.writeAsync(input)
      .then(() => console.log('data sent:', input))
    )
  })
  .catch(e => console.log('ERROR', e))
