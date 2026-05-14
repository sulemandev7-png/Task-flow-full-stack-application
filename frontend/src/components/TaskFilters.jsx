function TaskFilters({ filters, onChange, onReset }) {
  function handleChange(event) {
    onChange({
      ...filters,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div className="filter-grid">
      <div className="field-group">
        <label className="field-label" htmlFor="filter-status">Status filter</label>
        <select className="field-control" id="filter-status" name="status" value={filters.status} onChange={handleChange}>
          <option value="ALL">All statuses</option>
          <option value="TODO">To do</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="filter-priority">Priority filter</label>
        <select className="field-control" id="filter-priority" name="priority" value={filters.priority} onChange={handleChange}>
          <option value="ALL">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="filter-reset">Reset filters</label>
        <button className="btn btn-ghost" id="filter-reset" type="button" onClick={onReset}>
          Clear filters
        </button>
      </div>
    </div>
  )
}

export default TaskFilters