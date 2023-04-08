import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((routeObj) => {
    return routeObj.method === method && routeObj.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path) // /users/1 => ["/users/1", "1"]
    const { query, ...params } = routeParams.groups
    req.params = params
    req.query = query ? extractQueryParams(query) : {}
    return route.handler(req, res)
  }

  return res.writeHead(404).end('Not found')
})

server.listen(3333, () => console.log('Server is running on port 3333 👀'))
