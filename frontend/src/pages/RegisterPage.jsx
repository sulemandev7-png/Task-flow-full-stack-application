import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AuthShell from '../components/AuthShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await register(formData)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to create account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Start with a private TaskFlow workspace backed by your own API and database." alternateLabel="Already registered?" alternateLink="/login">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="name">Full name</label>
          <input className="field-control" id="name" name="name" required value={formData.name} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="email">Email</label>
          <input className="field-control" id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="password">Password</label>
          <input className="field-control" id="password" name="password" type="password" minLength="6" required value={formData.password} onChange={handleChange} />
        </div>

        {errorMessage ? <div className="feedback feedback-error">{errorMessage}</div> : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <p className="muted">
          Have an account? <Link className="link-text" to="/login">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default RegisterPage