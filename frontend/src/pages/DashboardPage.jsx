import { useEffect, useMemo, useState } from 'react'

import api from '../api/api.js'
import TaskCard from '../components/TaskCard.jsx'
import TaskFilters from '../components/TaskFilters.jsx'
import TaskForm from '../components/TaskForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const initialFilters = {
  status: 'ALL',
  priority: 'ALL',
}

function DashboardPage() {
  const { logout, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [activeTask, setActiveTask] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState(null)

  async function loadTasks(nextFilters = filters) {
    setErrorMessage('')
    setIsLoading(true)

    try {
      const params = {}

      if (nextFilters.status !== 'ALL') {
        params.status = nextFilters.status
      }

      if (nextFilters.priority !== 'ALL') {
        params.priority = nextFilters.priority
      }

      const { data } = await api.get('/tasks', { params })
      setTasks(data)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks(filters)
  }, [])

  async function handleSaveTask(formData) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || null,
      }

      if (activeTask) {
        await api.put(`/tasks/${activeTask.id}`, payload)
        setSuccessMessage('Task updated successfully.')
      } else {
        await api.post('/tasks', payload)
        setSuccessMessage('Task created successfully.')
      }

      setActiveTask(null)
      await loadTasks(filters)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to save task')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteTask(taskId) {
    setDeletingTaskId(taskId)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await api.delete(`/tasks/${taskId}`)
      setSuccessMessage('Task deleted successfully.')
      if (activeTask?.id === taskId) {
        setActiveTask(null)
      }
      await loadTasks(filters)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to delete task')
    } finally {
      setDeletingTaskId(null)
    }
  }

  async function handleFilterChange(nextFilters) {
    setFilters(nextFilters)
    await loadTasks(nextFilters)
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const todo = tasks.filter((task) => task.status === 'TODO').length
    const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS').length
    const done = tasks.filter((task) => task.status === 'DONE').length

    return { total, todo, inProgress, done }
  }, [tasks])

  return (
    <div className="page">
      <div className="dashboard">
        <section className="dashboard-panel">
          <div className="dashboard-header">
            <div>
              <p className="section-label">Protected workspace</p>
              <h1 className="dashboard-title">Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h1>
              <p className="dashboard-copy">Build, track, and finish your highest-value tasks from one secure dashboard.</p>
            </div>

            <div className="dashboard-actions">
              <button className="btn btn-secondary" type="button" onClick={() => loadTasks(filters)}>
                Refresh
              </button>
              <button className="btn btn-ghost" type="button" onClick={logout}>
                Log out
              </button>
            </div>
          </div>

          <div style={{ height: '20px' }} aria-hidden="true"></div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="metric-label">Total tasks</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="metric-label">To do</div>
              <div className="stat-value">{stats.todo}</div>
            </div>
            <div className="stat-card">
              <div className="metric-label">In progress</div>
              <div className="stat-value">{stats.inProgress}</div>
            </div>
            <div className="stat-card">
              <div className="metric-label">Done</div>
              <div className="stat-value">{stats.done}</div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="task-panel">
            <p className="section-label">{activeTask ? 'Edit task' : 'Create task'}</p>
            <h2 className="auth-title">{activeTask ? 'Refine the details' : 'Add a new task'}</h2>
            <p className="muted">Capture title, priority, progress status, and a due date for the task.</p>
            <div style={{ height: '20px' }} aria-hidden="true"></div>

            <TaskForm activeTask={activeTask} onSubmit={handleSaveTask} onCancel={() => setActiveTask(null)} isSaving={isSaving} />
          </section>

          <section className="task-panel">
            <div className="task-card-header">
              <div>
                <p className="section-label">Task list</p>
                <h2 className="auth-title">Your current queue</h2>
              </div>
            </div>

            <div style={{ height: '12px' }} aria-hidden="true"></div>

            <TaskFilters filters={filters} onChange={handleFilterChange} onReset={() => handleFilterChange(initialFilters)} />

            <div style={{ height: '20px' }} aria-hidden="true"></div>

            {errorMessage ? <div className="feedback feedback-error">{errorMessage}</div> : null}
            {successMessage ? <div className="feedback feedback-success">{successMessage}</div> : null}

            <div style={{ height: '18px' }} aria-hidden="true"></div>

            {isLoading ? (
              <div className="empty-state">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">No tasks match the current filter. Create a new task or clear the filters.</div>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={setActiveTask} onDelete={handleDeleteTask} isDeleting={deletingTaskId === task.id} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage