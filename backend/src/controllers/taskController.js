const mongoose = require('mongoose')

const Task = require('../models/Task')

const allowedStatuses = ['TODO', 'IN_PROGRESS', 'DONE']
const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH']

function formatTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }
}

function buildTaskPayload(body) {
  const payload = {
    title: body.title?.trim(),
    description: body.description?.trim() || null,
    status: body.status,
    priority: body.priority,
    dueDate: body.dueDate ? new Date(body.dueDate) : null,
  }

  if (!payload.title) {
    const error = new Error('Task title is required')
    error.statusCode = 400
    throw error
  }

  if (!allowedStatuses.includes(payload.status)) {
    const error = new Error('Task status is invalid')
    error.statusCode = 400
    throw error
  }

  if (!allowedPriorities.includes(payload.priority)) {
    const error = new Error('Task priority is invalid')
    error.statusCode = 400
    throw error
  }

  if (payload.dueDate && Number.isNaN(payload.dueDate.getTime())) {
    const error = new Error('Due date is invalid')
    error.statusCode = 400
    throw error
  }

  return payload
}

async function getTasks(request, response, next) {
  try {
    const query = {
      user: request.user.id,
    }

    if (request.query.status && allowedStatuses.includes(request.query.status)) {
      query.status = request.query.status
    }

    if (request.query.priority && allowedPriorities.includes(request.query.priority)) {
      query.priority = request.query.priority
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 })

    response.json(tasks.map(formatTask))
  } catch (error) {
    next(error)
  }
}

async function createTask(request, response, next) {
  try {
    const payload = buildTaskPayload(request.body)
    const task = await Task.create({
      ...payload,
      user: request.user.id,
    })

    response.status(201).json(formatTask(task))
  } catch (error) {
    next(error)
  }
}

async function updateTask(request, response, next) {
  try {
    const taskId = request.params.id

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return response.status(400).json({ message: 'Task id is invalid' })
    }

    const existingTask = await Task.findOne({ _id: taskId, user: request.user.id })

    if (!existingTask) {
      return response.status(404).json({ message: 'Task not found' })
    }

    const payload = buildTaskPayload(request.body)
    Object.assign(existingTask, payload)
    await existingTask.save()

    response.json(formatTask(existingTask))
  } catch (error) {
    next(error)
  }
}

async function deleteTask(request, response, next) {
  try {
    const taskId = request.params.id

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return response.status(400).json({ message: 'Task id is invalid' })
    }

    const existingTask = await Task.findOne({ _id: taskId, user: request.user.id })

    if (!existingTask) {
      return response.status(404).json({ message: 'Task not found' })
    }

    await existingTask.deleteOne()

    response.status(204).send()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}