var _o = require('@carbon-io/carbon-core').bond._o(module)

module.exports = {
  MONGODB_URI: _o('env:CARBOND_TEST_MONGODB_URI') || 'mongodb://localhost:27017',
}
