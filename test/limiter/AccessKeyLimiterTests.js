
const assert = require('assert')

const sinon = require('sinon')

const o  = require('@carbon-io/carbon-core').atom.o(module)
const testtube = require('@carbon-io/carbon-core').testtube

const Service = require('../../lib/Service')
const Limiter = require('../../lib/limiter/Limiter')
const AccessKeyLimiter = require('../../lib/limiter/AccessKeyLimiter')
const WindowLimiterPolicy = require('../../lib/limiter/WindowLimiterPolicy')
const HttpErrors = require('@carbon-io/http-errors/lib/HttpErrors')


module.exports = o.main({
    _type: testtube.Test,
    name: 'TestAccessKeyLimiter',
    description: 'Test AccessKeyLimiter',
    tests: [
        o({
            _type: testtube.Test,
            name: 'TestSendUnavailable',
            description: 'Test `sendUnavailable`',
            doTest: function () {
                const _handleErrorSpy = sinon.spy()
                const resSpy = sinon.spy()
                resSpy.append = sinon.spy()

                const limiter = o({
                    _type: AccessKeyLimiter,
                    policy: o({
                        _type: WindowLimiterPolicy,
                        window: 1000,
                        reqLimit: 1
                    })
                })

                const service = o({ _type: Service, _handleError: _handleErrorSpy})
                limiter.initialize(service, service)
                limiter.sendUnavailable(resSpy)

                assert(_handleErrorSpy.called)
                assert.equal(_handleErrorSpy.args[0].length, 2)
                assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.TooManyRequests)
                assert(_handleErrorSpy.args[0][1] === resSpy)
                assert(resSpy.append.args[0][0] === 'Retry-After')
                assert(resSpy.append.args[0][1] === '60')
            }
        })
    ]
})