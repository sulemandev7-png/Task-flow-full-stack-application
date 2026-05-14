import { Link } from 'react-router-dom'

function AuthShell({ title, subtitle, alternateLabel, alternateLink, children }) {
  return (
    <div className="page auth-page">
      <section className="auth-hero">
        <div>
          <p className="eyebrow">TaskFlow</p>
          <h1 className="headline">Run every task with momentum.</h1>
          <p className="auth-copy">
            A focused task board for teams and solo operators who want clear priorities,
            protected access, and a fast workflow.
          </p>
        </div>

        <div className="auth-metrics">
          <div className="metric">
            <span className="metric-label">Focus</span>
            <span className="metric-value">3 views</span>
          </div>
          <div className="metric">
            <span className="metric-label">Security</span>
            <span className="metric-value">JWT</span>
          </div>
          <div className="metric">
            <span className="metric-label">API</span>
            <span className="metric-value">REST</span>
          </div>
        </div>
      </section>

      <section className="auth-card">
        <p className="eyebrow">Welcome</p>
        <h2 className="auth-title">{title}</h2>
        <p className="auth-copy">{subtitle}</p>
        <div style={{ height: '24px' }} aria-hidden="true"></div>
        {children}
        <p className="muted">
          {alternateLabel} <Link className="link-text" to={alternateLink}>Continue here</Link>
        </p>
      </section>
    </div>
  )
}

export default AuthShell