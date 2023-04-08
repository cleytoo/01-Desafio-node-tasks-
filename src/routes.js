import { randomUUID } from 'node:crypto'

import { buildRoutePath } from './utils/build-route-params.js'
import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select(
        search ? { title: search, description: search } : null
      )

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: 'Missing required fields' }))
      }

      database.insert({
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const existsTask = database.selectOne(id)
      if (!existsTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }))
      }

      database.delete(id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const existsTask = database.selectOne(id)
      if (!existsTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }))
      }

      database.update(id, {
        title,
        description,
        updated_at: new Date().toISOString()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const existsTask = database.selectOne(id)
      if (!existsTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }))
      }

      database.completed(id)

      return res.writeHead(204).end()
    }
  }
]
