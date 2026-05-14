const nodemailer = require('nodemailer')

async function sendPasswordResetEmail({ email, name, resetUrl }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@taskflow.local'
  const subject = 'TaskFlow password reset'
  const text = `Hi ${name},\n\nReset your TaskFlow password using this link: ${resetUrl}\n\nThis link expires in 30 minutes.`

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`Password reset link for ${email}: ${resetUrl}`)
    return { loggedToConsole: true }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from,
    to: email,
    subject,
    text,
    html: `<p>Hi ${name},</p><p>Reset your TaskFlow password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes.</p>`,
  })

  return { loggedToConsole: false }
}

module.exports = sendPasswordResetEmail