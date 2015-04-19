Carbond
==========
***

Carbond is the server component of the Carbon.io. 

Contents
---------
* [ObjectServer](doc/classes/ObjectServer.md)
  * Databases
  * [Endpoints](doc/classes/Endpoint.md)
  * Basic endpoint types
  * Security
    * [Authentication](doc/Authentication.md)
    * [Access Control](doc/AccessControl.md)
    * [Security strategies](doc/SecurityStrategies.md)
* Starting an ObjectServer
* Auto-generated interactive API documentation (API Explorer)
* Logging
* Error handling
* Production best-practices
* Class reference
  * ObjectServer
  * Endpoint
  * Authenticator

ObjectServers and Endpoints
---------

APIs are defined via ```ObjectServers```. Put simply, an ```ObjectServer``` is an HTTP server that exposes a JSON REST API and which is defined as a tree of ```Endpoints```.

Each ```Endpoint``` represents a single URI and can support any number of the HTTP operations: ```GET```, ```POST```, ```PUT```, ```DELETE```, ```HEAD```, and ```OPTIONS```. 

Here is a very simple example of an ```ObjectServer``` that runs on port ```8888``` and that defines a single ```Endpoint``` at the path ```/hello``` which defines two operations, ```get``` and ```post```:

```node
var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fiber.__(module, true)

__(function() {
  module.exports = o({
    _type: carbon.carbond.ObjectServer,
    port: 8888,
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return { msg: "Hello World!" }
        },
        post: function(req) {
          return { msg: "Hello World! " + req.body }
        }
      })
    }
  })
})
```



