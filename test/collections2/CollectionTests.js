var assert = require('assert')
var url = require('url')

var _ = require('lodash')
var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var ejson = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../..')
var pong = require('../fixtures/pong')

var PongCollectionSubclass = oo({
  _type: pong.Collection,
  _init: function() {
    pong.Collection.prototype._init.apply(this, arguments)
  },
  FindConfigClass: oo({
    _type: carbond.collections.FindConfig,
    _C: function() {
      this.parameters = _.assignIn({
        foo: {
          location: 'header',
          schema: {
            type: 'string',
          },
          required: false
        },
        yaz: {
          location: 'header',
          schema: {
            type: 'string',
          },
          required: false
        },
      }, this.parameters)
    }
  }),
  FindObjectConfigClass: oo({
    _type: carbond.collections.FindObjectConfig,
    _C: function() {
      this.parameters = _.assignIn({
        foo: {
          location: 'header',
          schema: {
            type: 'string',
          },
          required: false
        },
        yaz: {
          location: 'header',
          schema: {
            type: 'string',
          },
          required: false
        },
      }, this.parameters)
    }
  }),
})

__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'CollectionTests',
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'CollectionLevelParameterTests',
        service: o({
          _type: carbond.Service,
          endpoints: {
            foo: o({
              _type: carbond.collections.Collection,
              enabled: {
                find: true,
                insert: true
              },
              idParameterName: 'foo',
              idPathParameterName: 'foo',
              schema: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                },
                required: ['foo']
              },
              parameters: {
                bar: {
                  location: 'header',
                  schema: {
                    type: 'number',
                    minimum: 0
                  },
                  required: true
                }
              },
              findConfig: {
                parameters: {
                  $merge: {
                    bar: {
                      location: 'header',
                      schema: {
                        type: 'string',
                      },
                      required: false
                    }
                  }
                }
              },
              find: function(options) {
                return [{foo: '0', options: options}]
              },
              insert: function(objects, options) {
                var id = 0
                return _.map(objects, function(object) {
                  return _.assign(_.clone(object), {options: options, foo: (++id).toString()})
                })
              }
            })
          }
        }),
        tests: [
          {
            name: 'OptionalOperationParameterOverridesRequiredCollectionParameterNotPresentTest',
            reqSpec: {
              url: '/foo',
              method: 'GET'
            },
            resSpec: {
              statusCode: 200,
              body: [{
                foo: '0',
                options: {
                  foo: undefined,   // present because of the ID query parameter on colllection
                  bar: undefined
                }
              }]
            }
          },
          {
            name: 'OperationParameterSchemaOverridesRequiredCollectionParameterPresentValidTest',
            reqSpec: {
              url: '/foo',
              method: 'GET',
              headers: {
                bar: 0              // gets parsed as a string
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body) {
                assert.deepStrictEqual(body, [{
                  foo: '0',
                  options: {
                    foo: undefined,
                    bar: '0'
                  }
                }])
              }
            }
          },
          {
            name: 'RequiredCollectionParameterNotPresentTest',
            reqSpec: {
              url: '/foo',
              method: 'POST',
              body: [{}]
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'RequiredCollectionParameterPresentInvalidTest',
            reqSpec: {
              url: '/foo',
              method: 'POST',
              headers: {
                bar: 'foo'
              },
              body: [{}]
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'RequiredCollectionParameterPresentValidTest',
            reqSpec: {
              url: '/foo',
              method: 'POST',
              headers: {
                bar: 0
              },
              body: [{}]
            },
            resSpec: {
              statusCode: 201,
              body: function(body) {
                assert.deepStrictEqual(body, [{
                  foo: '1',
                  options: {
                    bar: 0
                  }
                }])
              }
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CollectionOperationParameterTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            foo: o({
              _type: pong.Collection,
              enabled: {
                find: true,
                findObject: true,
              },
              idParameterName: 'foo',
              idPathParameterName: 'foo',
              schema: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                },
                required: ['foo']
              },
              findConfig: {
                parameters: {
                  bar: {
                    location: 'header',
                    schema: {
                      type: 'string',
                    },
                    required: false
                  }
                }
              },
              findObjectConfig: {
                parameters: {
                  $merge: {
                    bar: {
                      location: 'header',
                      schema: {
                        type: 'string',
                      },
                      required: false
                    }
                  }
                }
              },
            }),
            bar: o({
              _type: PongCollectionSubclass,
              enabled: {
                find: true,
                findObject: true,
              },
              idParameterName: 'bar',
              idPathParameterName: 'bar',
              schema: {
                type: 'object',
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                required: ['bar']
              },
              findConfig: {
                parameters: {
                  $delete: 'foo'
                }
              },
              findObjectConfig: {
                parameters: {
                  $multiop: [
                    {$delete: 'foo'},
                    {
                      $merge: {
                        baz: {
                          location: 'header',
                          schema: {
                            type: 'string',
                          },
                          required: false
                        }
                      }
                    }
                  ],
                }
              },
            }),
          }
        }),
        tests: [
          o({
            _type: testtube.Test,
            name: 'ParametersUpdateTest',
            doTest: function(context) {
              let collections = this.parent.service.endpoints
              assert.deepEqual(collections.foo.get.parameters, {
                bar: {
                  name: 'bar',
                  location: 'header',
                  description: undefined,
                  schema: {type: 'string'},
                  required: false,
                  default: undefined
                },
                foo: {
                  name: 'foo',
                  location: 'query',
                  description: 'Id query parameter',
                  schema: {
                    oneOf: [
                      {type: 'string'},
                      {type: 'array', items: {type: 'string'}}
                    ]
                  },
                  required: false,
                  default: undefined
                }
              })
              assert.deepEqual(collections.foo.endpoints[':foo'].get.parameters, {
                bar: {
                  name: 'bar',
                  location: 'header',
                  description: undefined,
                  schema: { type: 'string' },
                  required: false,
                  default: undefined
                }
              })
              assert.deepEqual(collections.bar.get.parameters, {
                yaz: {
                  name: 'yaz',
                  location: 'header',
                  description: undefined,
                  schema: {type: 'string'},
                  required: false,
                  default: undefined
                },
                bar: {
                  name: 'bar',
                  location: 'query',
                  description: 'Id query parameter',
                  schema: {
                    oneOf: [
                      {type: 'string'},
                      {type: 'array', items: {type: 'string'}}
                    ]
                  },
                  required: false,
                  default: undefined
                }
              })
              assert.deepEqual(collections.bar.endpoints[':bar'].get.parameters, {
                yaz: {
                  name: 'yaz',
                  location: 'header',
                  description: undefined,
                  schema: {type: 'string'},
                  required: false,
                  default: undefined
                },
                baz: {
                  name: 'baz',
                  location: 'header',
                  description: undefined,
                  schema: {type: 'string'},
                  required: false,
                  default: undefined
                }
              })
            }
          }),
          {
            name: 'ImplicitMergeParamTest',
            setup: function() {
              this.handlerSpy = sinon.spy(this.parent.service.endpoints.foo, 'find')
            },
            teardown: function() {
              try {
                assert(this.handlerSpy.called)
                assert.ok(!_.includes(_.keys(this.handlerSpy.args[0][0]), 'baz'))
              } finally {
                this.handlerSpy.restore()
              }
            },
            reqSpec: {
              url: '/foo',
              method: 'GET',
              headers: {
                'x-pong': ejson.stringify({
                  find: [{ foo: '0'}]
                }),
                bar: 0,
                baz: 1
              },
              parameters: {
                foo: '"0"'
              }
            },
            resSpec: {
              statusCode: 200,
              body: [{foo: '0'}]
            }
          },
          {
            name: 'ExplicitMergeParamTest',
            setup: function() {
              this.handlerSpy = sinon.spy(this.parent.service.endpoints.foo, 'findObject')
            },
            teardown: function() {
              try {
                assert(this.handlerSpy.called)
                assert.ok(!_.includes(_.keys(this.handlerSpy.args[0][1]), 'baz'))
              } finally {
                this.handlerSpy.restore()
              }
            },
            reqSpec: {
              url: '/foo/0',
              method: 'GET',
              headers: {
                'x-pong': ejson.stringify({
                  findObject: {foo: '0'}
                }),
                bar: 0,
                baz: 1
              }
            },
            resSpec: {
              statusCode: 200,
              body: {foo: '0'}
            }
          },
          {
            name: 'DeleteParamTest',
            setup: function() {
              this.handlerSpy = sinon.spy(this.parent.service.endpoints.bar, 'find')
            },
            teardown: function() {
              try {
                assert(this.handlerSpy.called)
                assert.ok(!_.includes(_.keys(this.handlerSpy.args[0][0]), 'foo'))
              } finally {
                this.handlerSpy.restore()
              }
            },
            reqSpec: {
              url: '/bar',
              method: 'GET',
              headers: {
                'x-pong': ejson.stringify({
                  find: [{bar: '0'}]
                }),
                foo: 0,
                yaz: 1
              },
              parameters: {
                bar: '"0"'
              }
            },
            resSpec: {
              statusCode: 200,
              body: [{bar: '0'}]
            }
          },
          {
            name: 'MultiopParamTest',
            setup: function() {
              this.handlerSpy = sinon.spy(this.parent.service.endpoints.bar, 'findObject')
            },
            teardown: function() {
              try {
                assert(this.handlerSpy.called)
                assert.ok(!_.includes(_.keys(this.handlerSpy.args[0][1]), 'foo'))
                assert.ok(_.includes(_.keys(this.handlerSpy.args[0][1]), 'baz'))
              } finally {
                this.handlerSpy.restore()
              }
            },
            reqSpec: {
              url: '/bar/0',
              method: 'GET',
              headers: {
                'x-pong': ejson.stringify({
                  findObject: {bar: '0'}
                }),
                foo: 0,
                yaz: 1,
                baz: 2
              }
            },
            resSpec: {
              statusCode: 200,
              body: {bar: '0'}
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CollectionConfigResponseMutationTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            foo: o({
              _type: pong.Collection,
              enabled: {
                '*': true
              },
              idGenerator: pong.util.collectionIdGenerator,
              idParameterName: '_id',
              schema: {
                type: 'object',
                properties: {
                  _id: {type: 'string'},
                  foo: {type: 'string'},
                  bar: {type: 'string'},
                  baz: {type: 'string'}
                },
                required: ['_id', 'foo', 'bar', 'baz'],
                additionalProperties: false
              },
              insertConfig: {
                responses: {
                  '$201.schema.items.required': ['_id', 'foo', 'bar'],
                  '$201.schema.items.properties': {
                    $delete: 'baz'
                  },
                  '$400.description': 'Whoopsie-daisy!'
                }
              },
              insertObjectConfig: {
                responses: {
                  '201': {
                    statusCode: 201,
                    description: 'foo bar baz',
                    schema: {
                      type: 'object',
                      properties: {
                        _id: {type: 'string'}
                      },
                      required: ['_id'],
                      additionalProperties: false
                    },
                    headers: ['Location', 'carbonio-id']
                  }
                }
              },
              findConfig: {
                responses: {
                  '$200.headers[0]': 'foo'
                }
              },
              postFindOperation: function(result, config, req, res) {
                result = pong.Collection.prototype.postFindOperation.apply(this, arguments)
                res.append('foo', 'bar')
                return result
              },
              findObjectConfig: {
                responses: {
                  $merge: {
                    '200': {
                      statusCode: 200,
                      description: 'foo bar baz',
                      schema: {
                        type: 'object',
                        properties: {
                          _id: {type: 'string'}
                        },
                        required: ['_id'],
                        additionalProperties: false
                      },
                      headers: ['Location', 'carbonio-id']
                    }
                  }
                }
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.foo.idParameterName
          context.global.idHeaderName = this.service.endpoints.foo.idHeaderName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          delete context.global.idHeaderName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'ResponsesUpdateTest',
            doTest: function(context) {
              let collection = this.parent.service.endpoints.foo
              assert.deepEqual(collection.post.responses[201].schema.oneOf[0].items.required,
                               ['_id', 'foo', 'bar'])
              assert.deepEqual(collection.post.responses[201].schema.oneOf[0].items.properties, {
                  _id: {type: 'string'},
                  foo: {type: 'string'},
                  bar: {type: 'string'}
              })
              assert.equal(collection.post.responses[400].description, 'Whoopsie-daisy!')
              assert.deepEqual(collection.post.responses[201].schema.oneOf[1], {
                type: 'object',
                properties: {
                  _id: {type: 'string'}
                },
                required: ['_id'],
                additionalProperties: false
              })
              assert.equal(collection.get.responses[200].headers[0], 'foo')
              assert.deepEqual(collection.endpoints[`:${context.global.idParameterName}`].get.responses[200], {
                statusCode: 200,
                description: 'foo bar baz',
                schema: {
                  type: 'object',
                  properties: {
                    _id: {type: 'string'}
                  },
                  required: ['_id'],
                  additionalProperties: false
                },
                headers: ['Location', context.global.idHeaderName]
              })
            }
          }),
          {
            name: 'Insert201UnrequireBazSuccessTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: [{
                      [context.global.idParameterName]: '0',
                      foo: 'bar',
                      bar: 'baz'
                    }]
                  })
                },
                body: [{foo: 'bar', bar: 'baz', baz: '666'}]
              }
            },
            resSpec: {
              statusCode: 201,
              body: function(body, context) {
                assert.deepEqual(body, [{
                  [context.global.idParameterName]: '0',
                  foo: 'bar',
                  bar: 'baz'
                }])
              }
            }
          },
          {
            name: 'Insert201UnrequireBazFailAdditionalParameterTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: [{
                      [context.global.idParameterName]: '0',
                      foo: 'bar',
                      bar: 'baz',
                      baz: '666'
                    }]
                  })
                },
                body: [{foo: 'bar', bar: 'baz', baz: '666'}]
              }
            },
            resSpec: {
              statusCode: 500,
              body: function(body) {
                assert.ok(body.message.match(/^Output did not validate against: .+/))
              }
            }
          },
          {
            name: 'InsertObject201OverrideSuccessTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {[context.global.idParameterName]: '0'}
                  })
                },
                body: {foo: 'bar', bar: 'baz', baz: 'yaz'}
              }
            },
            resSpec: {
              statusCode: 201,
              body: function(body, context) {
                assert.deepEqual(body, {[context.global.idParameterName]: '0'})
              }
            }
          },
          {
            name: 'InsertObject201OverrideFailTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {
                      [context.global.idParameterName]: '0',
                      foo: 'bar',
                      bar: 'baz',
                      baz: 'yaz'
                    }
                  })
                },
                body: {foo: 'bar', bar: 'baz', baz: 'yaz'}
              }
            },
            resSpec: {
              statusCode: 500,
              body: function(body) {
                assert.ok(body.message.match(/^Output did not validate against: .+/))
              }
            }
          },
          {
            name: 'Find201OverrideSuccessTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    find: [{
                      [context.global.idParameterName]: '0',
                      foo: 'bar',
                      bar: 'baz',
                      baz: 'yaz'
                    }]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.equal(headers['foo'], 'bar')
              }
            }
          },
          {
            name: 'FindObject200ExplicitMergeSuccessTest',
            reqSpec: function(context) {
              return {
                url: '/foo/0',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: {
                      [context.global.idParameterName]: '0'
                    }
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepEqual(body, {
                  [context.global.idParameterName]: '0'
                })
              }
            }
          },
          {
            name: 'FindObject200ExplicitMergeFailTest',
            reqSpec: function(context) {
              return {
                url: '/foo/0',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: {
                      [context.global.idParameterName]: '0',
                      foo: 'bar'
                    }
                  })
                }
              }
            },
            resSpec: {
              statusCode: 500,
              body: function(body) {
                assert.ok(body.message.match(/^Output did not validate against:.+/))
              }
            }
          }
        ]
      })
    ]
  })
})

