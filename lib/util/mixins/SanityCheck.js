var _ = require('lodash')

ERROR_PROP = '__SanityChecker_error'

var SanityChecker = {
  setSanityCheckError: function(e) {
    this[ERROR_PROP] = e
  },

  getSanityCheckError: function(e) {
    return this[ERROR_PROP]
  },

  clearSanityCheckError: function() {
    delete this[ERROR_PROP]
  },

  isSane: function() {
    if (!_.isNil(this[ERROR_PROP])) {
      throw this[ERROR_PROP]
    }
  }
}

module.exports = SanityChecker
