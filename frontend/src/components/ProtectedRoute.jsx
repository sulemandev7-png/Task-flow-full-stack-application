import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <div className="page">
        <div className="dashboard-panel">
          <p className="section-label">Loading</p>
          <h1 className="dashboard-title">Preparing your workspace</h1>
          <p className="dashboard-copy">TaskFlow is restoring your session.</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute