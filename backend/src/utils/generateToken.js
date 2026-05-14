const jwt = require('jsonwebtoken')

function generateToken(userId) {
  return jwt.sign({ userId: String(userId) }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = generateToken