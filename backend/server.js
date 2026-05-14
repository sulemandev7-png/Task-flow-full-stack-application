require('dotenv').config()

const app = require('./src/app')
const connectDatabase = require('./src/lib/database')

const PORT = Number(process.env.PORT) || 5000

async function startServer() {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`TaskFlow API running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start TaskFlow API', error)
    process.exit(1)
  }
}

startServer()