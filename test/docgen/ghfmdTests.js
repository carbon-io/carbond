var assert = require('assert')
var crypto = require('crypto')
var fs = require('fs')

var _ = require('lodash')
var mockery = require('mockery')
var sinon = require('sinon')
var tmp = require('tmp')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube
var service = require('../fixtures/Service1')

module.exports = o({
  _type: testtube.Test,
  name: 'DocgenTests',
  description: 'docgen tests',
  _setup: function() {
    mockery.enable({
      useCleanCache: true,
      warnOnReplace: false,
      warnOnUnregistered: false
    })
  },
  _teardown: function() {
    mockery.disable()
  },
  tests: [
    o({
      _type: testtube.Test,
      name: 'singlePageTest',
      description: 'single page test',
      setup: function() {
        this.parent._setup()
        this.tmpFile = tmp.fileSync()
        this.sandbox = sinon.sandbox.create()
        this.sandbox.stub(process, 'argv', [
          'node', 'Service1.js', 'gen-static-docs', '-o', 'single-page', '--out', this.tmpFile.name
        ])
        this.sandbox.stub(process, 'exit', function() {
          throw new Error('exit')
        })
        this.service = _.cloneDeep(service)
        this.service.runMainInFiber = false
      },
      teardown: function() {
        this.tmpFile.removeCallback()
        this.sandbox.restore()
        this.parent._teardown()
      },
      doTest: function() {
        var self = this
        var o = require('@carbon-io/carbon-core').atom.o(require.main).main
        assert.throws(function() {
          o(self.service)
        }, Error)
        var fixtureHash = crypto.createHash('sha256')
        var serviceHash = crypto.createHash('sha256')
        fixtureHash.update(
          fs.readFileSync(
            __dirname + '/../fixtures/Service1_README.md'))
        var fileData = fs.readFileSync(this.tmpFile.name)
        assert(fileData.length > 0)
        serviceHash.update(fileData)
        assert.equal(
          serviceHash.digest('hex'), fixtureHash.digest('hex'))
      }
    })
  ]
})

