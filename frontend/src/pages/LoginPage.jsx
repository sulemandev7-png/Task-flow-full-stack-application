import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import AuthShell from '../components/AuthShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
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
      await login(formData)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Access your protected workspace and keep your task flow moving." alternateLabel="Need an account?" alternateLink="/register">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="email">Email</label>
          <input className="field-control" id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="password">Password</label>
          <input className="field-control" id="password" name="password" type="password" required value={formData.password} onChange={handleChange} />
        </div>

        <p className="muted">
          <Link className="link-text" to="/forgot-password">Forgot your password?</Link>
        </p>

        {errorMessage ? <div className="feedback feedback-error">{errorMessage}</div> : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p className="muted">
          New here? <Link className="link-text" to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default LoginPage