export const buildRoutePath = (path) => {
  const routeParameters = /:([a-zA-Z]+)/g // /:id
  const pathwithParams = path.replaceAll(
    routeParameters,
    '(?<$1>[a-zA-Z0-9-_]+)'
  )

  const pathRegex = new RegExp(`^${pathwithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}
