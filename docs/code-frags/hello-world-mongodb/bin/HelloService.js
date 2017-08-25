#!/usr/bin/env node

var carbon = require('carbon-io')
var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var o = carbon.atom.o(module)

__(function() {
  o.main({
    _type: _o('../lib/HelloService')
  })
})
