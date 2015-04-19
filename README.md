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

Operations
----------

Each endpoint can implement one or more operations representing each of the HTTP methods: ```GET```, ```PUT```, ```POST```, ```CREATE```, ```DELETE```, ```HEAD```, ```OPTIONS```. There is no requirement an endpoint implement all HTTP methods. It only needs to implement those it wishes to support.

Each operation is represented as either:
* A function of the form ```function(req, res)```
* An ```Operation``` object. This is more elaborate definition which allows for a description, parameter definitions, and other useful meta-data as well as a ```service``` method of the form ```function(req, res)```

When responding to HTTP requests, two styles are supported:
* An asynchronous style where operations write directly to the ```HttpResponse``` object passed to the operation. This style is useful when the operation needs to manipulate the ```HttpResponse``` object to do more than simply return JSON (e.g. set HTTP headers), or wished to pass the response to other functions.
* A synchronous style where the operation simply returns a JSON object from the operation, or throws an exception to signal an error condition. When using this style the ```HttpResponse``` parameter can be omitted from the function signature of the operation. This style is useful when programming in a more synchronous style and / or coordinating with exceptions thrown deeper in the call stack.

**Examples (asynchronous)**
```node
get: function(req, res) {
  res.send({ msg: "hello world!" })  
}
```

```node
get: {
  description: "My hello world operation",
  params: {}
  service: function(req, res) {
    res.send({ msg: "hello world!" })  
  }
}
```

**Examples (synchronous)**
```node
get: function(req) {
  return { msg: "hello world!" }
}
```

```node
get: {
  description: "My hello world operation",
  params: {}
  service: function(req) {
    return { msg: "hello world!" }
  }
}
```

