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
 * insert tests
 */
__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'CollectionAllowUnauthentedTests',
    authenticator: o({
      _type: carbond.security.ApiKeyAuthenticator,
      findUser: function(key) {
        return (key === 'foo') ? {name: 'foo'} : undefined
      }
    }),
    service: {
      $property: {
        get: function() {
          if (_.isNil(this._service)) {
            this._service = o({
              _type: pong.Service,
              authenticator: this.authenticator,
              endpoints: {
                rejectUnauthenticated: o({
                  _type: pong.Collection,
                  idGenerator: pong.util.collectionIdGenerator,
                  enabled: {'*': true}
                }),
                allowUnauthenticated: o({
                  _type: pong.Collection,
                  idGenerator: pong.util.collectionIdGenerator,
                  enabled: {'*': true},
                  insertConfig: {
                    allowUnauthenticated: true
                  },
                  insertObjectConfig: {
                    allowUnauthenticated: true
                  },
                  findConfig: {
                    allowUnauthenticated: true
                  },
                  findObjectConfig: {
                    allowUnauthenticated: true
                  },
                  saveConfig: {
                    allowUnauthenticated: true
                  },
                  saveObjectConfig: {
                    allowUnauthenticated: true
                  },
                  updateConfig: {
                    allowUnauthenticated: true
                  },
                  updateObjectConfig: {
                    allowUnauthenticated: true
                  },
                  removeConfig: {
                    allowUnauthenticated: true
                  },
                  removeObjectConfig: {
                    allowUnauthenticated: true
                  }
                }),
                insertAllowUnauthenticatedInsertObjectRejectUnauthenticated: o({
                  _type: pong.Collection,
                  idGenerator: pong.util.collectionIdGenerator,
                  enabled: {insert: true, insertObject: true},
                  insertConfig: {
                    allowUnauthenticated: true
                  }
                }),
                insertRejectUnauthenticatedInsertObjectAllowUnauthenticated: o({
                  _type: pong.Collection,
                  idGenerator: pong.util.collectionIdGenerator,
                  enabled: {insert: true, insertObject: true},
                  insertObjectConfig: {
                    allowUnauthenticated: true
                  },
                }),
                insertAndInsertObjectRejectUnauthenticated: o({
                  _type: pong.Collection,
                  idGenerator: pong.util.collectionIdGenerator,
                  enabled: {insert: true, insertObject: true}
                }),
              }
            })
          }
          return this._service
        }
      }
    },
    setup: function(context) {
      carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
      context.global.rejectUnauthenticatedId = this.service.endpoints.rejectUnauthenticated.idParameter
      context.global.allowUnauthenticatedId = this.service.endpoints.allowUnauthenticated.idParameter
    },
    teardown: function(context) {
      delete context.global.rejectUnauthenticatedId
      delete context.global.allowUnauthenticatedId
      pong.util.collectionIdGenerator.resetId()
      carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
    },
    doTest: function() {
      var idParameter = this.service.endpoints.allowUnauthenticated.idParameter
      var allMethods = _.without(carbond.Endpoint.prototype.ALL_METHODS, 'options')
      assert(_.isNil(this.service.endpoints.rejectUnauthenticated.allowUnauthenticated))
      for (var i = 0; i < allMethods; i++) {
        assert(_.includes(
          this.service.endpoints.allowUnauthenticated.allowUnauthenticated, allMethods[i]
        ))
      }
      for (var i = 0; i < allMethods; i++) {
        assert(_.includes(
          this.service.endpoints.allowUnauthenticated.endpoints[idParameter].allowUnauthenticated,
          allMethods[i]
        ))
      }
      assert(_.isNil(
        this.service.endpoints.insertAllowUnauthenticatedInsertObjectRejectUnauthenticated
                              .allowUnauthenticated
      ))
      assert(_.isNil(
        this.service.endpoints.insertRejectUnauthenticatedInsertObjectAllowUnauthenticated
                              .allowUnauthenticated
        ))
      assert(_.isNil(
        this.service.endpoints.insertAndInsertObjectRejectUnauthenticated.allowUnauthenticated))
    },
    tests: [

      // ------------
      // Insert Tests
      // ------------
      {
        name: 'InsertValidUserAuthenticationNotEnforcedTest',
        reqSpec: {
          url: '/allowUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'foo',
            'x-pong': ejson.stringify({
              insert: {$args: 0}
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 201
        }
      },
      {
        name: 'InsertInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: {
          url: '/allowUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insert: {$args: 0}
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 201
        }
      },
      {
        name: 'InsertValidUserAuthenticationEnforcedTest',
        reqSpec: {
          url: '/rejectUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'foo',
            'x-pong': ejson.stringify({
              insert: {$args: 0}
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 201
        }
      },
      {
        name: 'InsertInvalidUserAuthenticationEnforcedTest',
        reqSpec: {
          url: '/rejectUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insert: {$args: 0}
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 401
        }
      },
      {
        name: 'InsertOpInsertAllowUnauthenticatedInsertObjectRejectUnauthenticatedTest',
        reqSpec: {
          url: '/insertAllowUnauthenticatedInsertObjectRejectUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insert: {$args: 0}
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 401
        }
      },
      {
        name: 'InsertOpInsertRejectUnauthenticatedInsertObjectAllowUnauthenticatedTest',
        reqSpec: {
          url: '/insertRejectUnauthenticatedInsertObjectAllowUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insert: {$args: 0}
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 401
        }
      },
      {
        name: 'InsertOpInsertAndInsertObjectRejectUnauthenticatedTest',
        reqSpec: {
          url: '/insertAndInsertObjectRejectUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insert: {$args: 0}
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ------------------
      // InsertObject Tests
      // ------------------
      {
        name: 'InsertObjectValidUserAuthenticationNotEnforcedTest',
        reqSpec: {
          url: '/allowUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'foo',
            'x-pong': ejson.stringify({
              insertObject: {$args: 0}
            })
          },
          body: {foo: 'bar'}
        },
        resSpec: {
          statusCode: 201
        }
      },
      {
        name: 'InsertObjectInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: {
          url: '/allowUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insertObject: {$args: 0}
            })
          },
          body: {foo: 'bar'}
        },
        resSpec: {
          statusCode: 201
        }
      },
      {
        name: 'InsertObjectValidUserAuthenticationEnforcedTest',
        reqSpec: {
          url: '/rejectUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'foo',
            'x-pong': ejson.stringify({
              insertObject: {$args: 0}
            })
          },
          body: {foo: 'bar'}
        },
        resSpec: {
          statusCode: 201
        }
      },
      {
        name: 'InsertObjectInvalidUserAuthenticationEnforcedTest',
        reqSpec: {
          url: '/rejectUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insertObject: {$args: 0}
            })
          },
          body: {foo: 'bar'}
        },
        resSpec: {
          statusCode: 401
        }
      },
      {
        name: 'InsertObjectOpInsertAllowUnauthenticatedInsertObjectRejectUnauthenticatedTest',
        reqSpec: {
          url: '/insertAllowUnauthenticatedInsertObjectRejectUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insertObject: {$args: 0}
            })
          },
          body: {foo: 'bar'}
        },
        resSpec: {
          statusCode: 401
        }
      },
      {
        name: 'InsertObjectOpInsertRejectUnauthenticatedInsertObjectAllowUnauthenticatedTest',
        reqSpec: {
          url: '/insertRejectUnauthenticatedInsertObjectAllowUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insertObject: {$args: 0}
            })
          },
          body: {foo: 'bar'}
        },
        resSpec: {
          statusCode: 401
        }
      },
      {
        name: 'InsertObjectOpInsertAndInsertObjectRejectUnauthenticatedTest',
        reqSpec: {
          url: '/insertAndInsertObjectRejectUnauthenticated',
          method: 'post',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              insertObject: {$args: 0}
            })
          },
          body: {foo: 'bar'}
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ----------
      // Find Tests
      // ----------
      {
        name: 'FindValidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated',
            method: 'get',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                find: [{[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}]
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated',
            method: 'get',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                find: [{[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}]
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindValidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'get',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                find: [{[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}]
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindInvalidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'get',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                find: [{[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}]
              })
            }
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ----------------
      // FindObject Tests
      // ----------------
      {
        name: 'FindObjectValidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated/0',
            method: 'get',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                findObject: {[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindObjectInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated/0',
            method: 'get',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                findObject: {[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindObjectValidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated/0',
            method: 'get',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                findObject: {[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindObjectInvalidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated/0',
            method: 'get',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                findObject: {[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}
              })
            }
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // -----------------
      // Find Tests (HEAD)
      // -----------------
      {
        name: 'FindHEADValidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated',
            method: 'head',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                find: [{[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}]
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindHEADInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated',
            method: 'head',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                find: [{[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}]
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindHEADValidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'head',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                find: [{[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}]
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindHEADInvalidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'head',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                find: [{[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}]
              })
            }
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // -----------------------
      // FindObject Tests (HEAD)
      // -----------------------
      {
        name: 'FindObjectHEADValidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated/0',
            method: 'head',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                findObject: {[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindObjectHEADInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated/0',
            method: 'head',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                findObject: {[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindObjectHEADValidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated/0',
            method: 'head',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                findObject: {[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}
              })
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'FindObjectHEADInvalidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated/0',
            method: 'head',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                findObject: {[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}
              })
            }
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ----------
      // Save Tests
      // ----------
      {
        name: 'SaveValidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated',
            method: 'put',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                save: {$args: 0}
              })
            },
            body: [{[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}]
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'SaveInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated',
            method: 'put',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                save: {$args: 0}
              })
            },
            body: [{[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}]
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'SaveValidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'put',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                save: {$args: 0}
              })
            },
            body: [{[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}]
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'SaveInvalidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'put',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                save: {$args: 0}
              })
            },
            body: [{[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}]
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ----------------
      // SaveObject Tests
      // ----------------
      {
        name: 'SaveObjectValidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated/0',
            method: 'put',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                saveObject: {$args: 0}
              })
            },
            body: {[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'SaveObjectInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated/0',
            method: 'put',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                saveObject: {$args: 0}
              })
            },
            body: {[context.global.allowUnauthenticatedId]: '0', foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'SaveObjectValidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated/0',
            method: 'put',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                saveObject: {$args: 0}
              })
            },
            body: {[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'SaveObjectInvalidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated/0',
            method: 'put',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                saveObject: {$args: 0}
              })
            },
            body: {[context.global.rejectUnauthenticatedId]: '0', foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ------------
      // Update Tests
      // ------------
      {
        name: 'UpdateValidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated',
            method: 'patch',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                update: 1
              })
            },
            body: {foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'UpdateInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated',
            method: 'patch',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                update: 1
              })
            },
            body: {foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'UpdateValidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'patch',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                update: 1
              })
            },
            body: {foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'UpdateInvalidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'patch',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                update: 1
              })
            },
            body: {foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ------------------
      // UpdateObject Tests
      // ------------------
      {
        name: 'UpdateObjectValidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated/0',
            method: 'patch',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                updateObject: 1
              })
            },
            body: {foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'UpdateObjectInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/allowUnauthenticated/0',
            method: 'patch',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                updateObject: 1
              })
            },
            body: {foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'UpdateObjectValidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated/0',
            method: 'patch',
            headers: {
              'Api-Key': 'foo',
              'x-pong': ejson.stringify({
                updateObject: 1
              })
            },
            body: {foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'UpdateObjectInvalidUserAuthenticationEnforcedTest',
        reqSpec: function(context) {
          return {
            url: '/rejectUnauthenticated',
            method: 'patch',
            headers: {
              'Api-Key': 'bar',
              'x-pong': ejson.stringify({
                updateObject: 1
              })
            },
            body: {foo: 'bar'}
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ------------
      // Remove Tests
      // ------------
      {
        name: 'RemoveValidUserAuthenticationNotEnforcedTest',
        reqSpec: {
          url: '/allowUnauthenticated',
          method: 'delete',
          headers: {
            'Api-Key': 'foo',
            'x-pong': ejson.stringify({
              remove: 1
            })
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'RemoveInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: {
          url: '/allowUnauthenticated',
          method: 'delete',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              remove: 1
            })
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'RemoveValidUserAuthenticationEnforcedTest',
        reqSpec: {
          url: '/rejectUnauthenticated',
          method: 'delete',
          headers: {
            'Api-Key': 'foo',
            'x-pong': ejson.stringify({
              remove: 1
            })
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'RemoveInvalidUserAuthenticationEnforcedTest',
        reqSpec: {
          url: '/rejectUnauthenticated',
          method: 'delete',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              remove: 1
            })
          }
        },
        resSpec: {
          statusCode: 401
        }
      },

      // ------------------
      // RemoveObject Tests
      // ------------------
      {
        name: 'RemoveObjectValidUserAuthenticationNotEnforcedTest',
        reqSpec: {
          url: '/allowUnauthenticated/0',
          method: 'delete',
          headers: {
            'Api-Key': 'foo',
            'x-pong': ejson.stringify({
              removeObject: 1
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'RemoveObjectInvalidUserAuthenticationNotEnforcedTest',
        reqSpec: {
          url: '/allowUnauthenticated/0',
          method: 'delete',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              removeObject: 1
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'RemoveObjectValidUserAuthenticationEnforcedTest',
        reqSpec: {
          url: '/rejectUnauthenticated/0',
          method: 'delete',
          headers: {
            'Api-Key': 'foo',
            'x-pong': ejson.stringify({
              removeObject: 1
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 200
        }
      },
      {
        name: 'RemoveObjectInvalidUserAuthenticationEnforcedTest',
        reqSpec: {
          url: '/rejectUnauthenticated/0',
          method: 'delete',
          headers: {
            'Api-Key': 'bar',
            'x-pong': ejson.stringify({
              removeObject: 1
            })
          },
          body: [{foo: 'bar'}]
        },
        resSpec: {
          statusCode: 401
        }
      },
    ]
  })
})
