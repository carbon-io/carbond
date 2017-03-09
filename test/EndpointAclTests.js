var assert = require('assert')
var o  = require('@carbon-io/carbon-core').atom.o(module).main
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

function mockRequest(username) {
  return {
    headers: {
      authorization: 'Basic ' + Buffer(username + ':' + username, 'utf8').toString('base64')
    }
  }
}

/**************************************************************************
 * EndpointAclTests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: testtube.Test,

  /**********************************************************************
   * name
   */
  name: "EndpointAclTests",

  /**********************************************************************
   * doTest
   */
  doTest: function() {
    var service = o(_o('./fixtures/ServiceForEndpointAclTests'))
    service.start()

    var client = _o("http://localhost:"+service.port, {})
    var doit = function(endpoint, user, method, allowed) {
      var e = client.getEndpoint(endpoint)
      var fn = function() {
        if(method === 'get') {
          return e[method](mockRequest(user))
        } else {
          return e[method]({}, mockRequest(user))
        }
      }
      if(allowed) {
        assert(fn())
      } else {
        assert.throws(fn)
      }
    }
    // selfAndBelow: false
    doit("/api/e1/f1", "admin", "get",  true)
    doit("/api/e1/f1", "admin", "post", true)
    doit("/api/e1/f1", "bob",   "get",  true)
    doit("/api/e1/f1", "bob",   "post", false)
    doit("/api/e1/f1", "admin", "put",  false)

    // selfAndBelow: true
    doit("/api/e2/f2", "admin", "post", false)
    doit("/api/e2/f2", "admin", "get",  true)
    doit("/api/e2/f2", "bob",   "get",  false)
    doit("/api/e2/f2", "bob",   "post", false)

    // selfAndBelow: "get"
    doit("/api/e3/f3", "admin", "post", true)
    doit("/api/e3/f3", "admin", "get",  true)
    doit("/api/e3/f3", "bob",   "get",  false)
    doit("/api/e3/f3", "bob",   "post", false)

    // selfAndBelow: fn
    doit("/api/e4/f4", "admin", "post", false)
    doit("/api/e4/f4", "admin", "get",  true)
    doit("/api/e4/f4", "bob",   "get",  false)
    doit("/api/e4/f4", "bob",   "post", true)

    service.stop()
  }

})
