const assert = require('assert')

const o  = require('@carbon-io/carbon-core').atom.o(module).main
const testtube = require('@carbon-io/carbon-core').testtube

const AccessKeyLimiterSelector = require('../../lib/limiter/AccessKeyLimiterSelector')

module.exports = o({
    _type: testtube.Test,
    name: 'AccessKeyLimiterSelectorTests',
    description: 'AccessKeyLimiterSelector tests',
    tests: [
        o({
            _type: testtube.Test,
            name: 'TestKeyFn',
            description: 'Test key function',
            doTest: function() {
              const req = {
                headers: {
                    foo: {
                      bar: {
                        baz: 1
                      }
                    },
                    bar: {
                      baz: {
                        foo: 2
                      }
                    },
                    baz: {
                      foo: {
                        bar: 3
                      }
                    },

                    "access-key-id": "abc123"
                }
              }

              const s = o({
                _type: AccessKeyLimiterSelector
              })

              assert.equal(s.key(req), "abc123")
              
              delete req.headers["access-key-id"]
              assert.equal(s.key(req), "*")
            }
        }),
    ]
})