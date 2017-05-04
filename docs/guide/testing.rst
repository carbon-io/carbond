=======
Testing
=======

.. toctree::

.. todo:: highlight Carbon.io, Test Tube, Carbon Core, etc. in some way

For testing, Carbon.io comes with a testing framework called Test
Tube. Test Tube is a generic unit testing framework that comes as part
of the Carbon Core.

Carbond extends Test Tube's HTTP testing facility to provide an easy
way to test your Carbond :js:class:`~carbond.Service`\s.

Service Tests
-------------

The :js:class:`~carbond.test.ServiceTest` class is an extension of Test Tube's
:js:class:`~testtube.HttpTest`` class that you can use to write declarative
HTTP-based unit tests of APIs you make with Carbond.

Consider the following :js:class:`~carbond.Service`:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointExample.js
    :language: javascript
    :lines: 1-9, 11-
    :linenos:

.. code-block: javascript
 :linenos: 
 var carbon = require('carbon-io')
 var o  = carbon.atom.o(module).main
 var __ = carbon.fiber.__(module).main
 __(function() {
   module.exports = o({
     _type: carbon.carbond.Service,
     port: 8888,
     endpoints: {
       hello: o({
         _type: carbon.carbond.Endpoint,
         get: function(req) {
           return { msg: "Hello world!" }
         },
         post: function(req) {
           return { msg: req.params.msg }
         }
       })
     }
   })
 })

You can test your ``Service`` like so:

.. literalinclude:: ../code-frags/standalone-examples/ServiceTestTestingExample.js
    :language: javascript
    :linenos:
    :emphasize-lines: 13-24

.. code-block: javascript 
  :linenos:
  :emphasize-lines: 10-21
  var carbon = require('carbon-io') 
  var o  = carbon.atom.o(module).main 
  var __ = carbon.fibers.__(module).main
  __(function() {
    module.exports = o({
      _type: carbond.test.ServiceTest,
      name: "HelloWorldServiceTest",
      service: _o('./HelloWorldService'), // path to your Service
      tests: [
        {
          reqSpec: {
            url: '/hello',
            method: "GET"
          },
          resSpec: {
            statusCode: 200,
            body: { msg: "Hello world!" }
          }
        },
        {
          reqSpec: {
            url: '/hello',
            method: "POST",
            parameters: {
              msg: "Hello world!"
            }
          },
          resSpec: {
            statusCode: 200,
            body: { msg: "Hello world!" }
          }
        }
      ]
    })
  })
