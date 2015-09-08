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
  // 400's
  BadRequest: makeHttpErrorClass(400, "Bad Request"),
  Unauthorized: makeHttpErrorClass(401, 'Unauthorized'),
  PaymentRequired: makeHttpErrorClass(402, 'Payment Required'),
  Forbidden: makeHttpErrorClass(403, "Forbidden"),
  NotFound: makeHttpErrorClass(404, 'Not Found'),
  MethodNotAllowed: makeHttpErrorClass(405, 'Method Not Allowed'),
  NotAcceptable: makeHttpErrorClass(406, 'Not Acceptable'),
  ProxyAuthenticationRequired: makeHttpErrorClass(407, 'Proxy Authentication Required'),
  RequestTimeout: makeHttpErrorClass(408, 'Request Time-out'),
  Conflict: makeHttpErrorClass(409, 'Conflict'),
  Gone: makeHttpErrorClass(410, 'Gone'),
  LengthRequired: makeHttpErrorClass(411, 'Length Required'),
  PreconditionFailed: makeHttpErrorClass(412, 'Precondition Failed'),
  RequestEntityTooLarge: makeHttpErrorClass(413, 'Request Entity Too Large'),
  RequestURITooLarge: makeHttpErrorClass(414, 'Request-URI Too Large'),
  UnsupportedMediaType: makeHttpErrorClass(415, 'Unsupported Media Type'),
  RequestedRangenotSatisfiable: makeHttpErrorClass(416, 'Requested Range not Satisfiable'),
  ExpectationFailed: makeHttpErrorClass(417, 'Expectation Failed'),
  UnprocessableEntity: makeHttpErrorClass(422, 'Unprocessable Entity'),
  TooManyRequests: makeHttpErrorClass(429, 'Too Many Requests'),
  // 500's
  InternalServerError: makeHttpErrorClass(500, "Internal Server Error"),
  NotImplemented: makeHttpErrorClass(501, 'Not Implemented'),
  BadGateway: makeHttpErrorClass(502, 'Bad Gateway'),
  ServiceUnavailable: makeHttpErrorClass(503, 'Service Unavailable'),
  GatewayTimeOut: makeHttpErrorClass(504, 'Gateway Time-out'),
  HTTPVersionnotSupported: makeHttpErrorClass(505, 'HTTP Version not Supported'),
}

