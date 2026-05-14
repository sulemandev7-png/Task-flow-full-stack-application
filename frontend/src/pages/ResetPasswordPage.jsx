import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import api from '../api/api.js'
import AuthShell from '../components/AuthShell.jsx'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = useParams()
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, formData)
      setSuccessMessage(data.message)
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1200)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to reset password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell title="Reset password" subtitle="Choose a new password for your TaskFlow account." alternateLabel="Need to request a new link?" alternateLink="/forgot-password">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="password">New password</label>
          <input className="field-control" id="password" name="password" type="password" minLength="6" required value={formData.password} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
          <input className="field-control" id="confirmPassword" name="confirmPassword" type="password" minLength="6" required value={formData.confirmPassword} onChange={handleChange} />
        </div>

        {errorMessage ? <div className="feedback feedback-error">{errorMessage}</div> : null}
        {successMessage ? <div className="feedback feedback-success">{successMessage}</div> : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset password'}
          </button>
        </div>

        <p className="muted">
          Back to <Link className="link-text" to="/login">sign in</Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default ResetPasswordPage