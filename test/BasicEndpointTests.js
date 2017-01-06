var o  = require('@carbon-io/carbon-core').atom.o(module).main
var _o = require('@carbon-io/carbon-core').bond._o(module)

var carbond = require('..')

/**************************************************************************
 * BasicEndpointTests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: carbond.test.ServiceTest,

  /**********************************************************************
   * name
   */
  name: "BasicEndpointTests",

  /**********************************************************************
   * service
   */
  service: o(_o('./fixtures/Service1')),
  
  /**********************************************************************
   * tests
   */
  tests: [
    // Test GET
    {
      reqSpec: {
        url: '/api/e1',
        method: "GET"
      },
      resSpec: {
        statusCode: 200,
        body: {
          methodCalled: "get",
          reqParams: {}
        }
      }
    },
    
    // Test POST
    {
      reqSpec: {
        url: '/api/e1',
        method: "POST",
        body: {
          x: 1,
          y: 2
        }
      },
      resSpec: {
        statusCode: 200,
        body: {
          methodCalled: "post",
          reqParams: {},
          reqBody:  {
            x: 1, 
            y: 2
          }
        }
      }
    },
    
    // Test PUT
    {
      reqSpec: {
        url: '/api/e1',
        method: "PUT",
        body: {
          x: [1],
          y: 2
        }
      },
      resSpec: {
        statusCode: 200,
        body: {
          methodCalled: "put",
          reqParams: {},
          reqBody:  {
            x: [1], 
            y: 2
          }
        }
      }
    },

    // Test PATCH
    {
      reqSpec: {
        url: '/api/e1',
        method: "PATCH",
        body: {
          x: { a: 1 },
          y: 2
        }
      },
      resSpec: {
        statusCode: 200,
        body: {
          methodCalled: "patch",
          reqParams: {},
          reqBody:  {
            y: 2,
            x: { a: 1 }
          }
        }
      }
    },

    // Test DELETE
    {
      reqSpec: {
        url: '/api/e1',
        method: "DELETE",
        parameters: {
          n: 3,
          m: { x: "hello" }
        }
      },
      resSpec: {
        statusCode: 200,
        body: {
          methodCalled: "delete",
          reqParams: {
            n: '3', 
            m: '{"x":"hello"}'
          },
          middlewareCalled: true
        }
      }
    },
  ]
  
  
})
