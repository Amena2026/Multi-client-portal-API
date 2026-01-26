// extract functions for printing normal log messages and error messages into its own module
// good idea if we want to start writing logs to a file or sending them to an exteranl logging service 
// like graylog
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }