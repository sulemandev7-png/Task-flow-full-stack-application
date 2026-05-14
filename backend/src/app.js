const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const errorMiddleware = require('./middleware/errorMiddleware')

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ message: 'TaskFlow API is healthy' })
})

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use(errorMiddleware)

module.exports = app