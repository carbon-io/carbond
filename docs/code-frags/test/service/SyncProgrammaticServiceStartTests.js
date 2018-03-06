var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'SyncProgrammaticServiceStartTests',
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'SyncProgrammaticServiceStartServiceTests',
        service: _o('../../standalone-examples/ServiceSyncProgrammaticServiceStartExample').myService,
        tests: [
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello World!',
              },
            },
          },
        ],
      }),
      o({
        _type: testtube.Test,
        name: 'StartServiceTest',
        setup: function() {
          this.mod = _o('../../standalone-examples/ServiceSyncProgrammaticServiceStartExample')
          this.logInfoSpy = sinon.spy(this.mod.myService, 'logInfo')
        },
        teardown: function() {
          try {
            var startCalled = false
            var stopCalled = false
            for (var i = 0; i < this.logInfoSpy.callCount; i++) {
              if (this.logInfoSpy.getCall(i).args[0] === 'Service started') {
                startCalled = true
              }
              if (this.logInfoSpy.getCall(i).args[0] === 'Service stopped') {
                stopCalled = true
              }
            }
            assert(startCalled && stopCalled)
          } finally {
            this.logInfoSpy.restore()
          }
        },
        doTest: function() {
          this.mod.startService()
        },
      }),
    ],
  })
})



