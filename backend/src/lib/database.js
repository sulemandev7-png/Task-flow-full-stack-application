const mongoose = require('mongoose')

let listenersRegistered = false

function registerConnectionListeners() {
  if (listenersRegistered) {
    return
  }

  mongoose.connection.on('connected', () => {
    console.log(
      `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`,
    )
  })

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })

  listenersRegistered = true
}

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  registerConnectionListeners()
  await mongoose.connect(process.env.MONGODB_URI)
}

module.exports = connectDatabase