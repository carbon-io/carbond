var util = require('util')

/******************************************************************************
 * @class HttpError
 */
function HttpError(message, code, description, captureStackTrace) {
  Error.call(this)

  // capture stack trace unless passed false
  if (captureStackTrace !== false) {
    Error.captureStackTrace(this, arguments.callee)
  }

  this.code = code || 500
  this.description = description || "InternalServiceError"
  this.message = message
}
util.inherits(HttpError, Error)

/******************************************************************************
 * makeHttpErrorClass
 */
function makeHttpErrorClass(code, description) {
  var C = function(message) {
    HttpError.call(this, message, code, description, false)
    Error.captureStackTrace(this, arguments.callee)
  }
  util.inherits(C, HttpError)

  return C
}

/******************************************************************************
 * module.exports
 */
module.exports = {
  HttpError: HttpError,
  BadRequest: makeHttpErrorClass(400, "Bad Request"),
  Forbidden: makeHttpErrorClass(403, "Forbidden"),
  InternalServerError: makeHttpErrorClass(500, "Internal Server Error")
}

