const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const sendPasswordResetEmail = require('../utils/sendPasswordResetEmail')

function buildAuthResponse(user) {
  return {
    token: generateToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

async function registerUser(request, response, next) {
  try {
    const { name, email, password } = request.body

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Name, email, and password are required' })
    }

    const normalizedEmail = email.toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return response.status(409).json({ message: 'A user with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    response.status(201).json(buildAuthResponse(user))
  } catch (error) {
    next(error)
  }
}

async function loginUser(request, response, next) {
  try {
    const { email, password } = request.body

    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return response.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return response.status(401).json({ message: 'Invalid credentials' })
    }

    response.json(buildAuthResponse(user))
  } catch (error) {
    next(error)
  }
}

async function getCurrentUser(request, response, next) {
  try {
    response.json({
      id: request.user.id,
      name: request.user.name,
      email: request.user.email,
    })
  } catch (error) {
    next(error)
  }
}

async function forgotPassword(request, response, next) {
  try {
    const { email } = request.body

    if (!email) {
      return response.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    const genericMessage = 'If an account exists for that email, a reset link has been sent.'

    if (!user) {
      return response.json({ message: genericMessage })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.passwordResetToken = hashedResetToken
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000)
    await user.save()

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
    const delivery = await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    })

    response.json({
      message: genericMessage,
      ...(delivery.previewUrl ? { previewUrl: delivery.previewUrl } : {}),
      ...(delivery.loggedToConsole ? { resetUrl } : {}),
    })
  } catch (error) {
    next(error)
  }
}

async function resetPassword(request, response, next) {
  try {
    const { password, confirmPassword } = request.body

    if (!password || !confirmPassword) {
      return response.status(400).json({ message: 'Password and confirm password are required' })
    }

    if (password !== confirmPassword) {
      return response.status(400).json({ message: 'Passwords do not match' })
    }

    if (password.length < 6) {
      return response.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    const hashedResetToken = crypto.createHash('sha256').update(request.params.token).digest('hex')

    const user = await User.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetExpires: { $gt: new Date() },
    })

    if (!user) {
      return response.status(400).json({ message: 'Reset link is invalid or has expired' })
    }

    user.password = await bcrypt.hash(password, 10)
    user.passwordResetToken = null
    user.passwordResetExpires = null
    await user.save()

    response.json({ message: 'Password reset successful. You can now sign in.' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
}