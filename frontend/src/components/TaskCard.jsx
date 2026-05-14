function formatDate(dateValue) {
  if (!dateValue) {
    return 'No due date'
  }

  return new Date(dateValue).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function labelize(value) {
  return value.replace('_', ' ')
}

function TaskCard({ task, onEdit, onDelete, isDeleting }) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <div>
          <h3 className="task-title">{task.title}</h3>
          <p className="task-meta">Due {formatDate(task.dueDate)}</p>
        </div>

        <div className="badge-row">
          <span className={`badge badge-status-${task.status}`}>{labelize(task.status)}</span>
          <span className={`badge badge-priority-${task.priority}`}>{labelize(task.priority)}</span>
        </div>
      </div>

      <p>{task.description || 'No additional description provided for this task.'}</p>

      <div className="task-card-footer">
        <span className="muted">Created {formatDate(task.createdAt)}</span>
        <div className="task-toolbar">
          <button className="btn btn-secondary" type="button" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="btn btn-danger" type="button" disabled={isDeleting} onClick={() => onDelete(task.id)}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default TaskCard