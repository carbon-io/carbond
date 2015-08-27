var ObjectServer = require('../lib/ObjectServer')
var o  = require('atom').o(module)
var __ = require('fiber').__(module, true)

__(function() {
  module.exports = o({
    _type: ObjectServer
  })
})
