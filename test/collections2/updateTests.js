var assert = require('assert')
var url = require('url')

var _ = require('lodash')
var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var ejson = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../..')
var pong = require('../fixtures/pong')

/**************************************************************************
 * update tests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: 'UpdateTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'DefaultConfigUpdateTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            update: o({
              _type: pong.Collection,
              enabled: {update: true}
            })
          }
        }),
        tests: [
          {
            name: 'UpdateTest',
            description: 'Test PATCH',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  update: 1
                })
              },
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
          {
            name: 'UpdateNoBodyTest',
            description: 'Test PATCH with no body',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  update: 0
                })
              }
              // NOTE: an undefined body gets converted to `{}` which complies with the default
              //       update schema
            },
            resSpec: {
              statusCode: 200,
              body: {n: 0}
            }
          },
          {
            name: 'UpdateReturnValueValidationTest',
            description: 'Test invalid handler return value',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  update: {n: 0}
                })
              }
            },
            resSpec: {
              statusCode: 500,
            }
          },
          {
            name: 'UpdateUpsertButNotSupportedTest',
            description: 'Test upsert throws when not supported',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  update: {val: {$args: 0}, created: true}
                })
              },
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
          {
            name: 'UpdateUpsertWithUpsertParamButNotSupportedTest',
            description: 'Test upsert throws when not supported even if "upsert" parameter passed',
            setup: function() {
              this.preUpdateOperationSpy = sinon.spy(this.parent.service.endpoints.update, 'preUpdateOperation')
              this.updateSpy = sinon.spy(this.parent.service.endpoints.update, 'update')
            },
            teardown: function() {
              try {
                assert(!('upsert' in this.preUpdateOperationSpy.firstCall.args[1].parameters))
                assert(!('upsert' in this.updateSpy.firstCall.args[0]))
              } finally {
                this.preUpdateOperationSpy.restore()
                this.updateSpy.restore()
              }
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                upsert: true
              },
              headers: {
                'x-pong': ejson.stringify({
                  update: {val: {$args: 0}, created: true}
                })
              },
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CustomSchemaConfigUpdateTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            update: o({
              _type: pong.Collection,
              enabled: {update: true},
              updateConfig: {
                updateSchema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                      pattern: '^(bar|baz|yaz)$'
                    }
                  },
                  patternProperties: {
                    '^\\d+$': {type: 'string'}
                  },
                  additionalProperties: false
                }
              }
            })
          }
        }),
        tests: [
          {
            name: 'FailUpdateSchemaTest',
            description: 'Test PATCH with malformed body',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  update: 1
                })
              },
              body: {
                bar: 'foo',
                666: 'foo'
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'SuccessUpdateSchemaTest',
            description: 'Test PATCH with well formed body',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  update: 1
                })
              },
              body: {
                foo: 'bar',
                666: 'foo'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'SupportsUpsertDoesNotReturnUpsertedObjectsConfigUpdateTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            update: o({
              _type: pong.Collection,
              enabled: {update: true},
              updateConfig: {
                supportsUpsert: true
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.update.idParameter
          context.global.idHeader = this.service.endpoints.update.idHeader
        },
        teardown: function(context) {
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'UpdateWithUpsertMissingParameterTest',
            description: 'Test PATCH fails when upsert performed but not requested',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  update: {
                    val: 1,
                    created: true
                  }
                })
              },
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
          {
            name: 'UpdateWithUpsertTest',
            description: 'Test PATCH results in upsert when requested',
            reqSpec: function(context) {
              return {
                url: '/update',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                headers: {
                  'x-pong': ejson.stringify({
                    update: {
                      val: [{[context.global.idParameter]: '0'}],
                      created: true
                    }
                  })
                },
                body: {
                  foo: 'bar'
                }
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(headers.location, '/update?' + context.global.idParameter + '=0')
                assert.deepStrictEqual(headers[context.global.idHeader], '["0"]')
              },
              body: {n: 1}
            }
          },
          {
            name: 'UpdateWithUpsertReturnsNumberOfUpsertedObjectsTest',
            description: 'Test PATCH fails when number of upserted objects returned',
            reqSpec: function(context) {
              return {
                url: '/update',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                headers: {
                  'x-pong': ejson.stringify({
                    update: {
                      val: 1,
                      created: true
                    }
                  })
                },
                body: {
                  foo: 'bar'
                }
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'SupportsUpsertReturnUpsertedObjectsConfigUpdateTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            update: o({
              _type: pong.Collection,
              enabled: {update: true},
              updateConfig: {
                supportsUpsert: true,
                returnsUpsertedObjects: true
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.update.idParameter
          context.global.idHeader = this.service.endpoints.update.idHeader
        },
        teardown: function(context) {
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'UpdateWithUpsertMissingParameterTest',
            description: 'Test PATCH fails when upsert performed but not requested',
            reqSpec: function(context) {
              return {
                url: '/update',
                method: 'PATCH',
                headers: {
                  'x-pong': ejson.stringify({
                    update: {
                      val: [{[context.global.idParameter]: '0', foo: 'bar'}],
                      created: true
                    }
                  })
                },
                body: {
                  foo: 'bar'
                }
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
          {
            name: 'UpdateWithUpsertTest',
            description: 'Test PATCH results in upsert when requested',
            reqSpec: function(context) {
              return {
                url: '/update',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                headers: {
                  'x-pong': ejson.stringify({
                    update: {
                      val: [{[context.global.idParameter]: '0', foo: 'bar'}],
                      created: true
                    }
                  })
                },
                body: {
                  foo: 'bar'
                }
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(headers.location, '/update?' + context.global.idParameter + '=0')
                assert.deepStrictEqual(headers[context.global.idHeader], '["0"]')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [{[context.global.idParameter]: '0', foo: 'bar'}])
              }
            }
          },
          {
            name: 'UpdateWithUpsertReturnsNumberOfUpsertedObjectsTest',
            description: 'Test PATCH fails when number of upserted objects returned',
            reqSpec: function(context) {
              return {
                url: '/update',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                headers: {
                  'x-pong': ejson.stringify({
                    update: {
                      val: 1,
                      created: true
                    }
                  })
                },
                body: {
                  foo: 'bar'
                }
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
        ]
      })
    ]
  })
})

