/***************************************************************************************************
 * @namespace collection
 */

/***************************************************************************************************
 * @class CollectionError
 */
class CollectionError extends Error {
  constructor(message, other) {
    super(...args)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
    this.other = other
  }
}
