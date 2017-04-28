========
Services
========

.. toctree::

APIs are defined via ``Service``\ s. Put simply, a ``Service`` is an 
HTTP server that exposes a JSON REST API and which is defined as a 
tree of ``Endpoint``\s. 

Services and Endpoints
----------------------

All ``Service`` definitions follow the same general structure:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleExample.js
    :language: javascript
    :lines: 1-8,15-16,23-
    :linenos:  

.. code-block javascript 
  var carbon = require('carbon-io') 
  var o  = carbon.atom.o(module) 
  var __ = carbon.fibers.__(module, true) 
  __(function() {
    module.exports = o({
      _type: carbon.carbond.Service,
      port: 8888,
      endpoints: {
        // Endpoint definitions go here
      }
    })
  })

Here is an example of a simple ``Service`` that runs on port ``8888``
and that defines a single ``Endpoint`` at the path ``/hello`` which a
defines a single ``get`` operation:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleExample.js
    :language: javascript
    :lines: 1-8,15-
    :linenos:  

.. code-block javascript 
  var carbon = require('carbon-io') 
  var o  = carbon.atom.o(module).main 
  var __ = carbon.fibers.__(module).main
  __(function() {
    module.exports = o({
      _type: carbon.carbond.Service,
      port: 8888,
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            return { msg: "Hello World!" }
          }
        }) 
      }
    }) 
  })

Service middleware 
------------------

You can register Express-style middleware for your service via the ``middleware``
property on your ``Service`` object:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleExample.js
    :language: javascript
    :lines: 1-16,23-
    :linenos:  

.. code-block javascript
  :linenos:
  :emphasize-lines: 9-14
  var carbon = require('carbon-io')
  var o  = carbon.atom.o(module).main
  var __ = carbon.fibers.__(module).main
  __(function() {
    module.exports = o({
      _type: carbon.carbond.Service,
      port: 8888,
      middleware: [
        function(req, res, next) {
          console.log("This is called on every request")
          next()
        } 
      ]
      endpoints: {
        // Endpoint definitions go here
      }
    }) 
  }) 

.. _running-services-from-the-command-line-label:

Running Services from the command line
--------------------------------------

In most cases you will want to start and stop your ``Service`` from
the command line.

This can be done by ensuring the value of ``o`` you are using to
define your ``Service`` is the ``main`` version of the library, as
shown below on line 6:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleExample.js
    :language: javascript
    :lines: 1-8,15-16,23-
    :linenos:  
    :emphasize-lines: 6

.. code-block javascript
  :linenos:
  :emphasize-lines: 2
  var carbon = require('carbon-io')
  var o  = carbon.atom.o(module).main
  var __ = carbon.fibers.__(module).main
  __(function() {
    module.exports = o({
      _type: carbon.carbond.Service,
      port: 8888
    }) 
  }) 

You can then start your ``Service`` like this:

..  literalinclude:: ../shell-frags/shell-output-starting-service.rst 
    :language: sh 

You can use ``-h`` or ``--help`` to get command help from your
``Service``:

.. todo:: remove doc generation command?

..  literalinclude:: ../shell-frags/shell-output-service-help.rst 
    :language: sh 

You can see that there are two sub-commands. One for starting the
server and another for generating documentation for your ``Service``.

The default sub-command is ``start-server``, and will be run if you
omit a sub-command (e.g. ``<path-to-your-app>/MyService``): 

.. todo:: remove some options (limiter?) here?

..  literalinclude:: ../shell-frags/shell-output-service-ss-help.rst 
    :language: sh 

Embedding Services into larger applications *(advanced use)*
------------------------------------------------------------

While you will usually run your ``Service``\s via the command line as a
top-level application, ``Service`` objects can also be used as a
library (although it is not common). 

By using the ``start`` and ``stop`` methods, you can manage the
``Service`` lifecyle manually. 

These methods have both an asynchronous and a synchronous interface:

**Asynchronous example**

.. literalinclude:: ../code-frags/standalone-examples/ServiceAsyncProgrammaticServiceStartExample.js
    :language: javascript
    :lines: 1-40
    :linenos:

..  code-block javascript 
  var carbon = require('carbon-io')
  var o  = carbon.atom.o(module)    // IMPORTANT to not use o(module).main
  var __ = carbon.fibers.__(module) // IMPORTANT to not use __(module).main
  var myService = o({
    _type: carbon.carbond.Service,
    port: 8888 
    . 
    . 
    . 
  }) 
  myService.start({}, function(err) {
    if (err) {
      myService.logError("Error starting service " + err) 
    } else {
      myService.logInfo("Service started" + err) 
      //
      // Do stuff...
      //
      myService.stop(function(err) {
        myService.logInfo("Service stopped") 
      }) 
    }
  })

**Synchronous example**

.. literalinclude:: ../code-frags/standalone-examples/ServiceSyncProgrammaticServiceStartExample.js
    :language: javascript
    :lines: 1-39
    :linenos:

.. code-block javascript 
  var carbon = require('carbon-io') 
  var o  = carbon.atom.o(module)    // IMPORTANT to not use o(module).main
  var __ = carbon.fibers.__(module) // IMPORTANT to not use __(module).main
  var myService = o({
    _type: carbon.carbond.Service,
    port: 8888 
    . 
    . 
    . 
  }) 
  // Run in a fiber
  __(function() { 
    try {
      myService.start()
      //
      // Do stuff...
      //
      myService.stop()
    } catch (e) {
      myService.logError(e)
    }
  })

Important note: you should not find yourself starting and stopping 
services like this (by manually calling ``start()`` and ``stop()``)
frequently. In most use-cases you will simply use the command line
invocation described in the previous section.
