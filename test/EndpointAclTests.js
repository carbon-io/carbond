var assert = require('assert')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var carbond = require('..')

function basicAuthString(username) {
  return 'Basic ' + Buffer(username + ':' + username, 'utf8').toString('base64')
}
var USER_HEADERS = {
  ADMIN: {authorization: basicAuthString('admin')},
  BOB: {authorization: basicAuthString('bob')},
}
var ENDPOINTS = {
  SAB_FALSE: '/api/e1/f1',
  SAB_TRUE: '/api/e2/f2',
  SAB_GET: '/api/e3/f3',
  SAB_FUNCTION: '/api/e4/f4',
}

/**************************************************************************
 * EndpointAclTests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: carbond.test.ServiceTest,

    /**********************************************************************
     * name
     */
    name: 'EndpointAclTests',

    /**********************************************************************
     * description
     */
    description: 'Test ACL composition in hierarchical endpoints',

    /**********************************************************************
     * service
     */
    service: _o('./fixtures/ServiceForEndpointAclTests'),

    /**********************************************************************
     * tests
     */
    tests: [
      // selfAndBelow: false
      {
        reqSpec: {url: ENDPOINTS.SAB_FALSE, method: 'GET', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 200},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_FALSE, method: 'POST', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 200},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_FALSE, method: 'GET', headers: USER_HEADERS.BOB},
        resSpec: {statusCode: 200},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_FALSE, method: 'POST', headers: USER_HEADERS.BOB},
        resSpec: {statusCode: 403},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_FALSE, method: 'PUT', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 404},
      },

      // selfAndBelow: true
      {
        reqSpec: {url: ENDPOINTS.SAB_TRUE, method: 'POST', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 403},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_TRUE, method: 'GET', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 200},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_TRUE, method: 'GET', headers: USER_HEADERS.BOB},
        resSpec: {statusCode: 403},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_TRUE, method: 'POST', headers: USER_HEADERS.BOB},
        resSpec: {statusCode: 403},
      },

      // selfAndBelow: "get"

      {
        reqSpec: {url: ENDPOINTS.SAB_GET, method: 'POST', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 200},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_GET, method: 'GET', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 200},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_GET, method: 'GET', headers: USER_HEADERS.BOB},
        resSpec: {statusCode: 403},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_GET, method: 'POST', headers: USER_HEADERS.BOB},
        resSpec: {statusCode: 403},
      },

      // selfAndBelow: fn
      {
        reqSpec: {url: ENDPOINTS.SAB_FUNCTION, method: 'POST', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 403},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_FUNCTION, method: 'GET', headers: USER_HEADERS.ADMIN},
        resSpec: {statusCode: 200},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_FUNCTION, method: 'GET', headers: USER_HEADERS.BOB},
        resSpec: {statusCode: 403},
      },
      {
        reqSpec: {url: ENDPOINTS.SAB_FUNCTION, method: 'POST', headers: USER_HEADERS.BOB},
        resSpec: {statusCode: 200},
      },
    ],
  })
})
