const logger = require('./logger')

const requestLogger = (request, response, next) => {
  const start = Date.now()
  
  response.on('finish', () => {
    logger.info({
      method: request.method,
      path: request.originalUrl,
      query: request.query,
      status: response.statusCode,
      duration: `${Date.now() - start}ms`,
      ip: request.ip
    })
  })
  
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    requestLogger,
    unknownEndpoint
}