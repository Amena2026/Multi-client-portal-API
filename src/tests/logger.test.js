// src/tests/logger.test.js
const { test, describe } = require('node:test')
const assert = require('node:assert')

describe('logger', () => {
  test('info logs to console.log', (t) => {
    // Mock console.log to capture what's logged
    const logs = []
    // Use ...args to capture ALL arguments passed to console.log
    t.mock.method(console, 'log', (...args) => logs.push(args))

    const logger = require('../utils/logger')
    logger.info('hello', 'world')

    // logs is now [ ['hello', 'world'] ] - an array of call arguments
    assert.deepStrictEqual(logs[0], ['hello', 'world'])
  })

  test('error logs to console.error', (t) => {
    const errors = []
    t.mock.method(console, 'error', (...args) => errors.push(args))

    const logger = require('../utils/logger')
    logger.error('something went wrong')

    assert.deepStrictEqual(errors[0], ['something went wrong'])
  })
})
