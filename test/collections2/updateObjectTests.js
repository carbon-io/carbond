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
 * updateObject tests
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
    name: 'UpdateObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'DefaultConfigUpdateObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            updateObject: o({
              _type: pong.Collection,
              enabled: {updateObject: true}
            })
          }
        }),
        tests: [
          {
            name: 'UpdateObjectTest',
            description: 'Test PATCH',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: 1
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
            name: 'UpdateObjectNotFoundTest',
            description: 'Test PATCH of non-existent object',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: 0
                })
              },
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 404
            }
          },
          {
            name: 'UpdateObjectInvalidNumberOfObjectsUpdatedTest',
            description: 'Test handler returns invalid number of objects updated',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: 2
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
            name: 'UpdateObjectNoBodyTest',
            description: 'Test PATCH with no body',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: 1
                })
              }
              // NOTE: an undefined body gets converted to `{}` which complies with the default
              //       update schema
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
          {
            name: 'UpdateObjectReturnValueValidationTest',
            description: 'Test invalid handler return value',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: {n: 0}
                })
              }
            },
            resSpec: {
              statusCode: 500,
            }
          },
          {
            name: 'UpdateObjectUpsertButNotSupportedTest',
            description: 'Test upsert throws when not supported',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: {val: {$args: 0}, created: true}
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
            name: 'UpdateObjectUpsertWithUpsertParamButNotSupportedTest',
            description: 'Test upsert throws when not supported even if "upsert" parameter passed',
            setup: function() {
              this.preUpdateObjectOperationSpy =
                sinon.spy(this.parent.service.endpoints.updateObject, 'preUpdateObjectOperation')
              this.updateObjectSpy = sinon.spy(this.parent.service.endpoints.updateObject, 'updateObject')
            },
            teardown: function() {
              try {
                assert(!('upsert' in this.preUpdateObjectOperationSpy.firstCall.args[1].parameters))
                assert(!('upsert' in this.updateObjectSpy.firstCall.args[1]))
              } finally {
                this.preUpdateObjectOperationSpy.restore()
                this.updateObjectSpy.restore()
              }
            },
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              parameters: {
                upsert: true
              },
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: {val: {$args: 0}, created: true}
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
        name: 'CustomSchemaConfigUpdateObject0Tests',
        service: o({
          _type: pong.Service,
          endpoints: {
            updateObject: o({
              _type: pong.Collection,
              enabled: {updateObject: true},
              updateObjectConfig: {
                updateObjectSchema: {
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
            }),
            updateObject1: o({
              _type: pong.Collection,
              enabled: {updateObject: true},
              updateObjectConfig: {
                '$parameters.update.schema': {
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
            name: 'FailUpdateObjectSchemaTest',
            description: 'Test PATCH with malformed body',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: 1
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
            name: 'SuccessUpdateObjectSchemaTest',
            description: 'Test PATCH with well formed body',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: 1
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
          {
            name: 'FailUpdateObject1SchemaTest',
            description: 'Test PATCH with malformed body',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(_.clone(this.history.getReqSpec('FailUpdateObjectSchemaTest')),
                              {url: '/updateObject1/0'})
            },
            resSpec: {
              $property: {get: function() {return this.history.getResSpec('FailUpdateObjectSchemaTest')}}
            }
          },
          {
            name: 'SuccessUpdateObject1SchemaTest',
            description: 'Test PATCH with well formed body',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(_.clone(this.history.getReqSpec('SuccessUpdateObjectSchemaTest')),
                              {url: '/updateObject1/0'})
            },
            resSpec: {
              $property: {get: function() {return this.history.getResSpec('SuccessUpdateObjectSchemaTest')}}
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'SupportsUpsertDoesNotReturnUpsertedObjectsConfigUpdateObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            updateObject: o({
              _type: pong.Collection,
              enabled: {updateObject: true},
              updateObjectConfig: {
                supportsUpsert: true
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.updateObject.idParameter
          context.global.idHeader = this.service.endpoints.updateObject.idHeader
        },
        teardown: function(context) {
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'UpdateObjectWithUpsertMissingParameterTest',
            description: 'Test PATCH fails when upsert performed but not requested',
            reqSpec: {
              url: '/updateObject/0',
              method: 'PATCH',
              headers: {
                'x-pong': ejson.stringify({
                  updateObject: {
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
            name: 'UpdateObjectWithUpsertTest',
            description: 'Test PATCH results in upsert when requested',
            reqSpec: function(context) {
              return {
                url: '/updateObject/0',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                headers: {
                  'x-pong': ejson.stringify({
                    updateObject: {
                      val: {[context.global.idParameter]: '0'},
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
                assert.deepStrictEqual(headers.location, '/updateObject/0')
                assert.deepStrictEqual(headers[context.global.idHeader], '"0"')
              },
              body: {n: 1}
            }
          },
          {
            name: 'UpdateObjectWithUpsertReturnsNumberOfUpsertedObjectsTest',
            description: 'Test PATCH fails when number of upserted objects returned',
            setup: function() {
              this.updateObjectSpy = sinon.spy(this.parent.service.endpoints.updateObject, 'updateObject')
            },
            teardown: function() {
              try {
                assert(this.updateObjectSpy.called)
                assert.deepStrictEqual(this.updateObjectSpy.firstCall.returnValue, {val: 1, created: true})
              } finally {
                this.updateObjectSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/updateObject/0',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                headers: {
                  'x-pong': ejson.stringify({
                    updateObject: {
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
        name: 'SupportsUpsertReturnUpsertedObjectsConfigUpdateObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            updateObject: o({
              _type: pong.Collection,
              enabled: {updateObject: true},
              updateObjectConfig: {
                supportsUpsert: true,
                returnsUpsertedObject: true
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.updateObject.idParameter
          context.global.idHeader = this.service.endpoints.updateObject.idHeader
        },
        teardown: function(context) {
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'UpdateObjectWithUpsertMissingParameterTest',
            description: 'Test PATCH fails when upsert performed but not requested',
            reqSpec: function(context) {
              return {
                url: '/updateObject/0',
                method: 'PATCH',
                headers: {
                  'x-pong': ejson.stringify({
                    updateObject: {
                      val: {[context.global.idParameter]: '0', foo: 'bar'},
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
            name: 'UpdateObjectWithUpsertTest',
            description: 'Test PATCH results in upsert when requested',
            reqSpec: function(context) {
              return {
                url: '/updateObject/0',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                headers: {
                  'x-pong': ejson.stringify({
                    updateObject: {
                      val: {[context.global.idParameter]: '0', foo: 'bar'},
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
                assert.deepStrictEqual(headers.location, '/updateObject/0')
                assert.deepStrictEqual(headers[context.global.idHeader], '"0"')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, {[context.global.idParameter]: '0', foo: 'bar'})
              }
            }
          },
          {
            name: 'UpdateObjectWithUpsertReturnsNumberOfUpsertedObjectsTest',
            description: 'Test PATCH fails when number of upserted objects returned',
            setup: function() {
              this.updateObjectSpy = sinon.spy(this.parent.service.endpoints.updateObject, 'updateObject')
            },
            teardown: function() {
              try {
                assert(this.updateObjectSpy.called)
                assert.deepStrictEqual(this.updateObjectSpy.firstCall.returnValue, {val: 1, created: true})
              } finally {
                this.updateObjectSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/updateObject/0',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                headers: {
                  'x-pong': ejson.stringify({
                    updateObject: {
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
        name: 'CustomConfigParameterTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            updateObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {updateObject: true},
              updateObjectConfig: {
                parameters: {
                  $merge: {
                    foo: {
                      location: 'header',
                      schema: {
                        type: 'number',
                        minimum: 0,
                        multipleOf: 2
                      }
                    }
                  }
                }
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.updateObject.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'UpdateObjectConfigCustomParameterInitializationTest',
            doTest: function(context) {
              let updateObjectOperation =
                this.parent.service.endpoints.updateObject.endpoints[`:${context.global.idParameter}`].patch
              assert.deepEqual(updateObjectOperation.parameters, {
                update: {
                  name: 'update',
                  location: 'body',
                  description: carbond.collections.UpdateObjectConfig._STRINGS.parameters.update.description,
                  schema: { type: 'object' },
                  required: true,
                  default: undefined
                },
                foo: {
                  name: 'foo',
                  location: 'header',
                  description: undefined,
                  schema: {type: 'number', minimum: 0, multipleOf: 2},
                  required: false,
                  default: undefined
                },
              })
            }
          }),
          {
            name: 'UpdateObjectConfigCustomParameterPassedViaOptionsFailTest',
            setup: function(context) {
              context.local.updateObjectSpy = sinon.spy(this.parent.service.endpoints.updateObject, 'updateObject')
            },
            teardown: function(context) {
              assert.equal(context.local.updateObjectSpy.called, false)
              context.local.updateObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/updateObject/0',
                method: 'PATCH',
                headers: {
                  'x-pong': ejson.stringify({
                    updateObject: 1
                  }),
                  foo: 3
                },
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'UpdateObjectConfigCustomParameterPassedViaOptionsSuccessTest',
            setup: function(context) {
              context.local.updateObjectSpy = sinon.spy(this.parent.service.endpoints.updateObject, 'updateObject')
            },
            teardown: function(context) {
              assert.equal(context.local.updateObjectSpy.firstCall.args[2].foo, 4)
              context.local.updateObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/updateObject/0',
                method: 'PATCH',
                headers: {
                  'x-pong': ejson.stringify({
                    updateObject: 1
                  }),
                  foo: 4
                },
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 200
            }
          }
        ]
      })
    ]
  })
})

