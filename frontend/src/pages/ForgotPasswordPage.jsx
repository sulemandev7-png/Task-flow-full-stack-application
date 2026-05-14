import { useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../api/api.js'
import AuthShell from '../components/AuthShell.jsx'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [resetPreviewUrl, setResetPreviewUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setResetPreviewUrl('')
    setIsSubmitting(true)

    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setSuccessMessage(data.message)
      setResetPreviewUrl(data.previewUrl || data.resetUrl || '')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to send reset link')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell title="Forgot password" subtitle="Enter your email and TaskFlow will prepare a password reset link." alternateLabel="Remembered it?" alternateLink="/login">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="email">Email</label>
          <input className="field-control" id="email" name="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>

        {errorMessage ? <div className="feedback feedback-error">{errorMessage}</div> : null}
        {successMessage ? <div className="feedback feedback-success">{successMessage}</div> : null}
        {resetPreviewUrl ? (
          <div className="feedback feedback-success">
            Reset link: <a className="link-text" href={resetPreviewUrl}>{resetPreviewUrl}</a>
          </div>
        ) : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </div>

        <p className="muted">
          Back to <Link className="link-text" to="/login">sign in</Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default ForgotPasswordPage