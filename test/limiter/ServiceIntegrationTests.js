var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var o  = require('@carbon-io/carbon-core').atom.o(module).main
var oo  = require('@carbon-io/carbon-core').atom.oo(module)
var tt = require('@carbon-io/test-tube')

var HttpErrors = require('@carbon-io/carbon-core').HttpErrors

var FunctionLimiter = require('../../lib/limiter/FunctionLimiter')
var ApiKeyAuthenticator = require('../../lib/security/ApiKeyAuthenticator')
var Service = require('../../lib/Service')
var Endpoint = require('../../lib/Endpoint')
var Operation = require('../../lib/Operation')
var ServiceTest = require('../../lib/test/ServiceTest')

var CountDownLimiter = oo({
  _type: FunctionLimiter,

  _C: function() {
    this.name = 'changeme'
    this.maxVisits = 2
  },

  _init: function() {
    FunctionLimiter.prototype._init.call(this)

    this.throttlingResponse = o({
      type: HttpErrors.ServiceUnavailable,
      message: this.name
    });

    this.state.visits = this.maxVisits
  },

  fn: function(req, res, next) {
    if (this.state.visits <= 0) {
      return this.sendUnavailable(res, next)
    }
    this.state.visits--
    next()
  }
})

var SimpleOperation = oo({
  _type: Operation,
  handle: function() {
    return this.endpoint.path + '::' + this.name
  }
})

var EndpointOperationLimiterTestService = {
  _type: Service,

  description: 'Service Endpoint/Operation Limiter integration testing',

  hostname: '127.0.0.1',
  port: 8888,

  verbosity: 'warn',

  enableBusyLimiter: false,

  authenticator: o({
    _type: ApiKeyAuthenticator,
    apiKeyParameterName: 'Api-Key',
    apiKeyLocation: 'header'
  }),

  limiter: o({
    _type: CountDownLimiter,
    name: 'serviceLimiter'
  }),

  endpoints: {
    foo: o({
      _type: Endpoint,
      limiter: o({
        _type: CountDownLimiter,
        preAuth: true,
        maxVisits: 4,
        name: '/foo::EndpointLimiter'
      }),
      get: o({
        _type: SimpleOperation,
        limiter: o({
          _type: CountDownLimiter,
          preAuth: true,
          maxVisits: 2,
          name: '/foo::get::OperationLimiter'
        })
      }),
      post: o({
        _type: SimpleOperation,
        limiter: o({
          _type: CountDownLimiter,
          preAuth: false,
          maxVisits: 2,
          name: '/foo::post::OperationLimiter'
        })
      }),
      endpoints: {
        bar: o({
          _type: Endpoint,
          limiter: o({
            _type: CountDownLimiter,
            maxVisits: 1,
            name: '/foo/bar::EndpointLimiter'
          }),
          get: o({
            _type: SimpleOperation,
          }),
        }),
      }
    }),
    bar: o({
      _type: Endpoint,
      limiter: o({
        _type: CountDownLimiter,
        preAuth: false,
        maxVisits: 4,
        name: '/bar::EndpointLimiter'
      }),
      get: o({
        _type: SimpleOperation,
        limiter: o({
          _type: CountDownLimiter,
          preAuth: true,
          maxVisits: 2,
          name: '/bar::get::OperationLimiter'
        })
      }),
      post: o({
        _type: SimpleOperation,
        limiter: o({
          _type: CountDownLimiter,
          preAuth: false,
          maxVisits: 2,
          name: '/bar::post::OperationLimiter'
        })
      }),
      endpoints: {
        foo: o({
          _type: Endpoint,
          limiter: o({
            _type: CountDownLimiter,
            maxVisits: 1,
            name: '/bar/foo::EndpointLimiter'
          }),
          get: o({
            _type: SimpleOperation,
          }),
        })
      }
    })
  }
}

var ServiceLimiterTestService = {
  _type: Service,

  description: 'Service Limiter integration testing',

  hostname: '127.0.0.1',
  port: 8888,

  verbosity: 'warn',

  enableBusyLimiter: false,

  serviceLimiter: o({
    _type: CountDownLimiter,
    preAuth: false,
    maxVisits: 3,
    name: '/::ServiceLimiter'
  }),

  authenticator: o({
    _type: ApiKeyAuthenticator,
    apiKeyParameterName: 'Api-Key',
    apiKeyLocation: 'header'
  }),

  limiter: o({
    _type: CountDownLimiter,
    maxVisits: 1,
    name: '/::ServiceEndpointLimiter'
  }),

  get: o({
    _type: SimpleOperation
  }),

  endpoints: {
    foo: o({
      _type: Endpoint,
      get: o({
        _type: SimpleOperation
      })
    })
  }
}

module.exports = o({
  _type: tt.Test,
  name: 'ServiceIntegrationTests',
  description: 'Service integration tests',
  tests: [
    o({
      _type: ServiceTest,
      name: 'ServiceEndpointOperationLimiterIntegrationTests',
      description: 'Service endpoint/operation limiter integration tests',
      service: o(EndpointOperationLimiterTestService),
      baseUrl: 'http://127.0.0.1:8888',
      _init: function() {
        ServiceTest.prototype._init.call(this)
      },
      setup: function () {
        ServiceTest.prototype.setup.call(this)
        sinon.stub(ApiKeyAuthenticator.prototype, 'findUser').callsFake(function() {
          return {
            username: 'foo'
          }
        })

        // @todo move into test setup

        // /foo
        sinon.spy(this.service.endpoints.foo.limiter, 'process')

        // /foo#get
        sinon.spy(this.service.endpoints.foo.get.limiter, 'process')

        // /foo#post
        sinon.spy(this.service.endpoints.foo.post.limiter, 'process')

        // /foo/bar
        sinon.spy(this.service.endpoints.foo.endpoints.bar.limiter, 'process')

        // /bar
        sinon.spy(this.service.endpoints.bar.limiter, 'process')

        // /bar#get
        sinon.spy(this.service.endpoints.bar.get.limiter, 'process')

        // /bar#post
        sinon.spy(this.service.endpoints.bar.post.limiter, 'process')

        // /bar/foo
        sinon.spy(this.service.endpoints.bar.endpoints.foo.limiter, 'process')
      },
      teardown: function () {
        ServiceTest.prototype.teardown.call(this)
        ApiKeyAuthenticator.prototype.findUser.restore()

        // @todo move into test teardown

        // /foo
        this.service.endpoints.foo.limiter.process.restore()

        // /foo#get
        this.service.endpoints.foo.get.limiter.process.restore()

        // /foo#post
        this.service.endpoints.foo.post.limiter.process.restore()

        // /foo/bar
        this.service.endpoints.foo.endpoints.bar.limiter.process.restore()

        // /bar
        this.service.endpoints.bar.limiter.process.restore()

        // /bar#get
        this.service.endpoints.bar.get.limiter.process.restore()

        // /bar#post
        this.service.endpoints.bar.post.limiter.process.restore()

        // /bar/foo
        this.service.endpoints.bar.endpoints.foo.limiter.process.restore()
      },
      // @todo check auth bits in limiter spies!
      tests: [
        // /foo/bar
        {
          reqSpec: {
            url: '/foo',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/foo::get'
          }
        },
        {
          reqSpec: {
            url: '/foo',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/foo::get'
          }
        },
        {
          reqSpec: {
            url: '/foo',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: '/foo::get::OperationLimiter'
            }
          }
        },
        {
          reqSpec: {
            url: '/foo',
            method: 'post',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/foo::post'
          }
        },
        {
          reqSpec: {
            url: '/foo',
            method: 'post',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: '/foo::EndpointLimiter'
            }
          }
        },
        {
          reqSpec: {
            url: '/foo/bar',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/foo/bar::get'
          }
        },
        {
          reqSpec: {
            url: '/foo/bar',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: '/foo/bar::EndpointLimiter'
            }
          }
        },
        // /bar/foo
        {
          reqSpec: {
            url: '/bar',
            method: 'get',
            headers: {
              'Api-Key': 'bar'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/bar::get'
          }
        },
        {
          reqSpec: {
            url: '/bar',
            method: 'get',
            headers: {
              'Api-Key': 'bar'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/bar::get'
          }
        },
        {
          reqSpec: {
            url: '/bar',
            method: 'get',
            headers: {
              'Api-Key': 'bar'
            }
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: '/bar::get::OperationLimiter'
            }
          }
        },
        {
          reqSpec: {
            url: '/bar',
            method: 'post',
            headers: {
              'Api-Key': 'bar'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/bar::post'
          }
        },
        {
          reqSpec: {
            url: '/bar',
            method: 'post',
            headers: {
              'Api-Key': 'bar'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/bar::post'
          }
        },
        // NOTE: because of the preAuth/postAuth ordering, one more request is
        //       allowed to get through before the endpoint limiter kicks in
        {
          reqSpec: {
            url: '/bar',
            method: 'post',
            headers: {
              'Api-Key': 'bar'
            }
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: '/bar::EndpointLimiter'
            }
          }
        },
        {
          reqSpec: {
            url: '/bar/foo',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/bar/foo::get'
          }
        },
        {
          reqSpec: {
            url: '/bar/foo',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: '/bar/foo::EndpointLimiter'
            }
          }
        },
      ]
    }),
    o({
      _type: ServiceTest,
      name: 'ServiceLimiterIntegrationTests',
      description: 'Service limiter integration tests',
      service: o(ServiceLimiterTestService),
      baseUrl: 'http://127.0.0.1:8888',
      _init: function() {
        ServiceTest.prototype._init.call(this)
      },
      setup: function() {
        ServiceTest.prototype.setup.call(this)
        sinon.stub(ApiKeyAuthenticator.prototype, 'findUser').callsFake(function() {
          return {
            username: 'foo'
          }
        })
      },
      teardown: function() {
        ServiceTest.prototype.teardown.call(this)
      },
      tests: [
        {
          reqSpec: {
            url: '/',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '::get'
          }
        },
        {
          reqSpec: {
            url: '/',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: '/::ServiceEndpointLimiter'
            }
          }
        },
        {
          reqSpec: {
            url: '/foo',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 200,
            body: '/foo::get'
          }
        },
        {
          reqSpec: {
            url: '/foo',
            method: 'get',
            headers: {
              'Api-Key': 'foo'
            }
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: '/::ServiceLimiter'
            }
          }
        },
      ],
    }),
  ],
})
