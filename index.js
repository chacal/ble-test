const MarineDisplay = require('./MarineDisplayDevice')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})


console.log('Scanning for devices..')

MarineDisplay.discoverAsync()
  .tap(display => {
    console.log('Discovered Marine Display:', display._peripheral.advertisement.localName)
    display.on('disconnect', () => console.log('Disconnected!'))
  })
  .then(display => display.connectAndSetupAsync())
  .tap(() => console.log('Connected'))
  .then(display => {
    rl.on('line', input => display.writeAsync(input)
      .then(() => console.log('data sent:', input))
    )
  })
  .catch(e => console.log('ERROR', e))
