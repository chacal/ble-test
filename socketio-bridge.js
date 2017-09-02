const SocketIO = require('socket.io-client')
const MarineDisplay = require('./MarineDisplayDevice')

const SERVER_URL = 'http://localhost:3001'

const socket = SocketIO(SERVER_URL)
socket.on('connect', () => console.log(`Connected to ${SERVER_URL}`))
socket.on('error', err => console.log('error', err))
socket.on('connect_error', err => console.log('connect_error', err))

connectToMarineDisplay()


function connectToMarineDisplay() {
  console.log('Scanning for devices..')

  MarineDisplay.discoverAsync()
    .tap(display => {
      console.log(`Discovered ${display.toString()}`)
      display.on('disconnect', tryToReconnect)
    })
    .then(display => display.connectAndSetupAsync())
    .tap(display => console.log(`Connected to ${display.toString()}`))
    .then(display => socket.on('command', buf => sendDataTo(display, buf)))
    .catch(e => console.log('ERROR', e))

  function tryToReconnect() {
    console.log('Disconnected, reconnecting..')
    socket.off('command')
    connectToMarineDisplay()
  }

  function sendDataTo(display, buf) {
    console.log(`Sending ${buf.length} bytes..`)
    const start = new Date()
    display.writeAsync(buf)
      .then(() => console.log(`Sent in ${new Date() - start}ms`))
  }
}
