var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Limiter = require('./Limiter')

/******************************************************************************
 * class FunctionLimiter
 * @implements Limiter
 */
var FunctionLimiter = oo({
  _type: Limiter,
  _ctorName: 'FunctionLimiter',

  _C: function() {
    this._fn = undefined
    this._state = undefined
  },

  _init: function() {
    Limiter.prototype._init.call(this)
    if (!_.isFunction(this.fn)) {
      throw new TypeError('fn must be a function')
    }
    if (this.fn.length < 2 || this.fn.length > 3) {
      throw new TypeError('fn must take 2 or 3 args')
    }
    this._state = {}
  },

  /**********************************************************************
   * property fn
   *
   * @description
   * </pre>
   * fn should have one of two signatures:
   *
   * - fn(req, res, next)
   * - fn(req, res)
   *
   * if fn has the signature (req, res), it should return true if the
   * request is allowed and false otherwise. 
   *
   * *NOTE*: if false is returned the response *must* be ended and 
   *         written or the request will hang. this is inherent to
   *         the use of express.
   * </pre>
   */
  fn: {
    $property: {
      get: function() {
        return this._fn
      },
      set: function(fn) {
        assert(_.isFunction(fn))
        this._fn = fn
      }
    }
  },

  state: {
    $property: {
      get: function() {
        return this._state
      }
    }
  },

  /**********************************************************************
   * @inheritdoc
   */
  process: function(req, res, next) {
    try {
      if (this.fn.length === 2) {
          if (this.fn.call(this, req, res)) {
            next()
          }
          // XXX: check that the request is ended
      } else {
        return this.fn.call(this, req, res, next)
      }
    } catch (err) {
      next(err)
    }
  }
})

module.exports = FunctionLimiter
