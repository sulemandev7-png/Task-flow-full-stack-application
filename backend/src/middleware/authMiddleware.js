const jwt = require('jsonwebtoken')

const User = require('../models/User')

async function authMiddleware(request, response, next) {
  try {
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return response.status(401).json({ message: 'Not authorized' })
    }

    const token = authorizationHeader.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decodedToken.userId).select('_id name email')

    if (!user) {
      return response.status(401).json({ message: 'Not authorized' })
    }

    request.user = user
    next()
  } catch (error) {
    return response.status(401).json({ message: 'Not authorized' })
  }
}

module.exports = authMiddleware