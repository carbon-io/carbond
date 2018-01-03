var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)

function multimixin(object) {
  let mixins = Array.prototype.slice.call(arguments, 1)
  for (let i = 0; i < mixins.length; i++) {
    object = _.mixin(object, mixins[i])
  }
  return object
}

module.exports = {
  OperationParametersInitializer: _o('./OperationParametersInitializer'),
  SanityCheck: _o('./SanityCheck'),
  multimixin: multimixin
}
