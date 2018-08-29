/**
 * @todo Integrate with {@link collections.Collection}
 */

var _ = require('lodash')

var HttpErrors = require('@carbon-io/carbon-core').HttpErrors
var oo = require('@carbon-io/carbon-core').atom.oo(module)
var o = require('@carbon-io/carbon-core').atom.o(module)

/******************************************************************************
 * @interface Limiter
 */
var Limiter = oo({
  _ctorName: 'Limiter',
  _C: function() {
    if (this.constructor === Limiter) {
      throw new Error('Interface')
    }
    /**
     * @member {carbond.Service}
     */
    this.service = undefined

    /**
     * @member {Service|Endpoint|Operation}
     *
     * @todo better name for this? node represents the top level {@link Service},
     *       an {@link Endpoint}, or an {@link Operation}
     */
    this.node = undefined

    /**
     * @member {boolean}
     */
    this.preAuth = false

    /**
     * @member {Atom}
     */
    this.throttlingResponse = undefined

    /**
     * @member {boolean}
     */
    this.logRejections = false

  },

  /**********************************************************************
   * method initialize
   *
   * @param {Service} service - the root `Service` object
   * @param {Service|carbond.Endpoint|carbond.Operation} [node] -
   *        the endpoint that this limiter is guarding
   */
  initialize: function(service, node) {
    this.service = service
    this.node = node
  },

  _init: function() {
    if (_.isUndefined(this.throttlingResponse) || _.isNull(this.throttlingResponse)) {
      this.throttlingResponse = o({
        error: HttpErrors.ServiceUnavailable,
        message: 'Service unavailable.'
      });
    }
  },

  /**********************************************************************
   * method process
   *
   * @param {Request} req - the request received
   * @param {Response} res - the response to be sent
   * @param {Function} next - pass control to the next request processor
   */
  process: function(req, res, next) {
    throw new Error('Not implemented')
  },

  /**********************************************************************
   * method sendUnavailable
   *
   * Send a generic "service unavailable" response. Subclasses should
   * customize if they need to message something more specific.
   *
   * @param {Response} res - the Response object
   * @param {function} - next function
   * @param {string|object} [message] - any other data you want to bubble up
   *                                    to the user (should be JSON
   *                                    serializable)
   * @param {integer} [retryAfter=60] - amount of time the client should
   *                                    wait before retrying the request
   *                                    (if null, do not include the header)
   * @throws TypeError
   */
  sendUnavailable: function(res, next, retryAfter) {
    const {error, message} = this.throttlingResponse;

    const err = new error(message)

    if (_.isUndefined(res)) {
      throw new TypeError('Expected a Response object but got undefined')
    }
    // XXX: probably shouldn't be using protected method
    if (_.isUndefined(retryAfter)) {
      retryAfter = 60
    }
    if (!(_.isNull(retryAfter) || _.isInteger(retryAfter))) {
      throw new TypeError('retryAfter must be undefined, null, or an integer')
    }
    if (!_.isNull(retryAfter)) {
      res.append('Retry-After', retryAfter.toString())
    }

    if (this.logRejections) {
      const endpoint = this.node.endpoint ? this.node.endpoint : this.node;
      const path = endpoint.path;

      this.service.logInfo(`Limiter rejected request at ${path}`);
    }

    if (next) {
      return next(err)
    }
    this.service._handleError(err, res)
  }
})

module.exports = Limiter
