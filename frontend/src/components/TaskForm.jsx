import { useEffect, useState } from 'react'

const emptyTask = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '',
}

function formatForInput(dateValue) {
  if (!dateValue) {
    return ''
  }

  return new Date(dateValue).toISOString().slice(0, 10)
}

function TaskForm({ activeTask, onSubmit, onCancel, isSaving }) {
  const [formData, setFormData] = useState(emptyTask)

  useEffect(() => {
    if (!activeTask) {
      setFormData(emptyTask)
      return
    }

    setFormData({
      title: activeTask.title,
      description: activeTask.description || '',
      status: activeTask.status,
      priority: activeTask.priority,
      dueDate: formatForInput(activeTask.dueDate),
    })
  }, [activeTask])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="field-label" htmlFor="title">Task title</label>
        <input className="field-control" id="title" name="title" placeholder="Ship onboarding redesign" required value={formData.title} onChange={handleChange} />
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="description">Description</label>
        <textarea className="field-control textarea" id="description" name="description" placeholder="Add any notes, requirements, or delivery detail" value={formData.description} onChange={handleChange} />
      </div>

      <div className="filter-grid">
        <div className="field-group">
          <label className="field-label" htmlFor="status">Status</label>
          <select className="field-control" id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="priority">Priority</label>
          <select className="field-control" id="priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="dueDate">Due date</label>
          <input className="field-control" id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
        </div>
      </div>

      <div className="button-row">
        <button className="btn btn-primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : activeTask ? 'Update task' : 'Create task'}
        </button>
        {activeTask ? (
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default TaskForm