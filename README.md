Carbond
==========
***

Carbond is the server component of Carbon.io. Carbond is a library and is meant to be installed by including a reference to ```carbon-io``` in your application's ```package.json``` file.

Contents
---------
* [Quick start](#quick-start)
* [Application structure](#application-structure)
* [ObjectServers and Endpoints](#objectservers-and-endpoints)
* [Operations](#operations)
* [Operation parameters](#operation-parameters)
* [Database management](#database-management)
* [Collections](#collections)
* Basic endpoint types
  * Endpoint
  * Collection
  * MongoDBCollection
* Security
  * [Authentication](doc/Authentication.md)
  * [Access Control](doc/AccessControl.md)
  * [Security strategies](doc/SecurityStrategies.md)
* Error handling
* Logging
* Running the ObjectServer
* API Explorer (auto-generated interactive API documentation)
* Class reference
  * [carbond.Collection](doc/classes/Collection.md)
  * [carbond.Endpoint](doc/classes/Endpoint.md)
  * [carbond.IdGenerator](doc/classes/IdGenerator.md)
  * [carbond.MongoDBCollection](doc/classes/MongoDBCollection.md)
  * [carbond.ObjectServer](doc/classes/ObjectServer.md)
  * [carbond.Operation](doc/classes/Operation.md)
  * [carbond.OperationParameter](doc/classes/OperationParameter.md)
  * [carbond.ObjectIdGenerator](doc/classes/ObjectIdGenerator.md)
  * [carbond.SslOptions](doc/classes/SslOptions.md)
  * [carbond.UserCollection](doc/classes/UserCollection.md)
  * [carbond.security.Acl](doc/classes/security/Acl.md)
  * [carbond.security.ApiKeyAuthenticator](doc/classes/security/ApiKeyAuthenticator.md)
  * [carbond.security.Authenticator](doc/classes/security/Authenticator.md)
  * [carbond.security.CollectionAcl](doc/classes/security/CollectionAcl.md)
  * [carbond.security.EndpointAcl](doc/classes/security/EndpointAcl.md)
  * [carbond.security.HttpBasicAuthenticator](doc/classes/security/HttpBasicAuthenticator.md)
  * [carbond.security.MongoDBApiKeyAuthenticator](doc/classes/security/MongoDBApiKeyAuthenticator.md)
  * [carbond.security.MongoDBHttpBasicAuthenticator](doc/classes/security/MongoDBHttpBasicAuthenticator.md)

Quick start
---------

For a quick start guide on how to create an API using Carbond, run it, and connect to it, please see the [main Carbon.io quick start guide](https://github.com/carbon-io/carbon-io/blob/master/README.md#quick-start-hello-world).

Application structure
---------

To build a ```carbond``` application you start by creating a standard node package:

```
<path-to-your-app>/
    package.json
```

Your ```package.json``` file should include ```carbon-io```

```json
{
    "name": "hello-world",
    "description": "Hello World API",
    "dependencies": {
        "carbon-io" : "> 0.1.0"
    }
}
```

You then install the package dependencies like so

```console
% cd <path-to-your-app>
% npm install .
```

Next you create your app / service. All ```carbond``` services will have the same top-level structure

```
<path-to-your-app>/
    package.json
    MyService.js
```

In ```MyService.js```:

```node
var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fiber.__(module, true)

__(function() {
  module.exports = o({
    _type: carbon.carbond.ObjectServer,
    .
    .
    .
    // implementation of your service goes here
    .
    .
    .
  })
})
```

The pre-ample requires the main ```carbon-io``` package as well as defines the ```o``` and ```__``` operators. 

```
var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fiber.__(module, true)
```

The ```o``` operatior is part of the Atom sub-project of Carbon.io and is what is used to define Carbon.io components. It is not crucial you understand this deeply at this point but you should eventually read the [Atom](https://github.com/carbon-io/atom) documentation to understand the Carbon.io component infrastructure as it is core to Carbon.io. 

The ```___``` is used to run this application inside of a [Fiber](https://github.com/carbon-io/fiber) when this module is invoked as the main module from the command line. Carbon.io makes heavy use of [Node Fibers](https://github.com/laverdet/node-fibers) to allow for applications to be written in a synchronous (as well as asynchronous) style. More details can be found in the documentation for the [Carbon.io ```fiber``` package](https://github.com/carbon-io/fiber). 

Finally, we define our top-level component and export it via ```module.exports```. While exporting the component we define is not strictly required if we only plan to use this service as a main module, it is useful to export it so that it can later be required as a library by other components or modules if desired.

The component is defined to be an instance of the ```carbond.ObjectServer``` class which, as we describe in the next section, is the top-level class used for defining services in ```carbond```.

```
module.exports = o({
    _type: carbon.carbond.ObjectServer
    .
    .
    .
})
```

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

```Endpoints``` (of which ```ObjectServer is a subclass```) can be defined using templated paths as well as have child endpoints. Here is an example of using templated paths:

```node
var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fiber.__(module, true)

__(function() {
  module.exports = o({
    _type: carbon.carbond.ObjectServer,
    port: 8888,
    endpoints: {
      'users': o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          // get all users
        }
      }),
      'users/:id': o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          // get the user
          return getUserById(req.params.id)
        },
        delete: function(req) {
          // delete the user
        }
      }),
    }
  })
})
```

Here is a similar example of the same API but using sub endpoints:

```node
var carbon = require('carbon-io')
var o  = carbon.atom.o(module)
var __ = carbon.fiber.__(module, true)

__(function() {
  module.exports = o({
    _type: carbon.carbond.ObjectServer,
    port: 8888,
    endpoints: {
      'users': o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          // get all users
        },
        endpoints: {
          ":id": o({
            _type: carbon.carbond.Endpoint,
            get: function(req) {
              // get the user
              return getUserById(req.params.id)
            },
            delete: function(req) {
              // delete the user
            }
          }),
        }
      }),
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
  res.send({ msg: "Hello World!" })  
}
```

```node
get: {
  description: "My hello world operation",
  parameters: {}
  service: function(req, res) {
    res.send({ msg: "Hello World!" })  
  }
}
```

**Examples (synchronous)**
```node
get: function(req) {
  return { msg: "Hello World!" }
}
```

```node
get: {
  description: "My hello world operation",
  parameters: {}
  service: function(req) {
    return { msg: "Hello World!" }
  }
}
```

Operation parameters
----------

Each ```Operation``` can define the set of parameters it takes. Each ```OperationParameter``` can specify the location of the parameter (path, query string, or body) as well as a JSON schema definition to which the parameter must conform. 

All parameters defined on an ```Operation``` will be available via the ```parameters``` property of the ```HttpRequest``` object and can be accessed as ```req.parameters[<parameter-name>]``` or ```req.parameters.<parameter-name>```.

Carbond supports both JSON and [EJSON](http://docs.mongodb.org/manual/reference/mongodb-extended-json/) (Extended JSON, which includes support additional types such as ```Date``` and ```ObjectId```). 

Formally defining parameters for operations helps you to build a self-describing API for which the framework can then auto-generate API documention and interactive administration tools. 

**Examples**

```node
{
  get: {
    description: "My hello world operation",
    parameters: {
      message: {
        description: "A message to say to the world",
        location: 'query',
        required: true,  
        schema: { type: 'string' }
      }
    }
    service: function(req) {
      return { msg: "Hello World! " + req.parameters.message }
    }
  }
}
```

```node
{
  post: {
    description: "Adds a Zipcode object to the zipcodes collection",
    parameters: {
      body: {
        description: "A Zipcode object",
        location: 'body',
        required: true,
        schema: { 
          type: 'object',
          properties: {
            _id: { type: 'number' },
            state: { type: 'string' }
          }
        }
      }
    }
    service: function(req) {
      this.objectserver.db.getCollection("zipcodes").insert(req.parameters.body)
    } 
  }
}
```

Database management
----------

Carbond makes it easy to manage connections to multiple databases in your application. The ```ObjectServer``` class has two properties for specifying database URIs. 

* ```dbUri```: A connection string specified as a [MongoDB URI](http://docs.mongodb.org/manual/reference/connection-string/) (e.g. ```"mongodb:username:password@localhost:27017/mydb"```). The ```ObjectServer``` will connect to this database on startup. The application can then reference a connection to this database via the ```db``` property on the application's ```ObjectServer```. 

* ```dbUris```: A mapping of names to MongoDB URIs. The ```ObjectServer``` will connect to these databases on startup. The application can reference a connection to these databases via the ```ObjectServer``` as ```dbs[<name>]``` or ```dbs.<name>```. <br/>

**Examples**

An ```ObjectServer``` with a single db connection:
```node
__(function() {
  module.exports = o({
    _type: carbon.carbond.ObjectServer,
    port: 8888,
    dbUri: "mongodb://localhost:27017/mydb",
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return this.db.getCollection('messages').find().toArray()
        }
      })
    }
  })
})
```

An ```ObjectServer``` that connects to multiple databases:
```node
__(function() {
  module.exports = o({
    _type: carbon.carbond.ObjectServer,
    port: 8888,
    dbUris: {
      main: "mongodb://localhost:27017/mydb",
      reporting: "mongodb://localhost:27017/reporting"
    }
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return this.dbs['main'].getCollection('messages').find().toArray()
        }
      }),
      goodbye: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return this.dbs['reporting'].getCollection('dashboards').find().toArray()
        }
      })
    }
  })
})
```

Collections
----------

Carbond ```Collection```s provide a high-level abstraction for defining ```Endpoint```s that behave like a collection of resources. When you define a ```Collection``` you define the following methods:
* ```insert```
* ```find```
* ```update```
* ```remove```
* ```getObject```
* ```updateObject```
* ```removeObject```

Which results in the following tree of ```Endpoint```s and ```Operations```:
* ```/<collection>```
  * ```GET``` which maps to ```find```
  * ```POST``` which maps to ```insert```
  * ```PUT``` which maps to ```update```
  * ```DELETE``` which maps to ```remove```
* ```/<collection>/:id```
  *  ```GET``` which maps to ```getObject```
  *  ```PUT``` which maps to ```updateObject```
  *  ```DELETE``` which maps to ```removeObject```
    

When defining a [```Collection```](doc/classes/Collection.md) one is not required to define all methods. For example, here is a collection that only defines the ```insert``` method:

**Example**
```node
__(function() {
  module.exports = o({
    _type: carbon.carbond.ObjectServer,
    port: 8888,
    dbUri: "mongodb://localhost:27017/mydb",
    endpoints: {
      feedback: o({
        _type: carbon.carbond.Collection,
        insert: function(obj) {
          return this.db.getCollection('feedback').insert(obj)
        }
      })
    }
  })
})
```

