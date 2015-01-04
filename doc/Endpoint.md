class Endpoint
----------

An ```Endpoint``` is a representation of a RESTFul resource. Each endpoint can implement one or more operations representing each of the HTTP methods: ```GET```, ```PUT```, ```POST```, ```DELETE```, ```CREATE```, ```HEAD```, ```OPTIONS```. 

Endpoints can also define child endpoints whose paths will be interpreted relative to the ```path``` of this ```Endpoint``` object.

Configuration
----------

```
{
  _type: 'datanode/Endpoint',

  [_get: <function> | <Operation>],
  [_put: <function> | <Operation>],
  [_post: <function> | <Operation>],
  [_delete: <function> | <Operation>],
  [_create: <function> | <Operation>],
  [_head: <function> | <Operation>],
  [_options: <function> | <Operation>],
  
  [get: <function> | <Operation>],
  [put: <function> | <Operation>],
  [post: <function> | <Operation>],
  [delete: <function> | <Operation>],
  [create: <function> | <Operation>],
  [head: <function> | <Operation>],
  [options: <function> | <Operation>],

  [endpoints: { 
    <string>: <Endpoint>
    ...
  }]
}
```

Properties
----------

* ```path``` (read-only) - the path to which this endpoint is bound. The path can contain variable patterns (e.g. ```'orders/:id'```). The ```path``` property is not configured directly on ```Endpoint``` objects but are specified as lvals in enclosing defininitions of endpoints such as in an ```ObjectServer``` or a parent ```Endpoint``` object. When retrieved the value of this property will be the absolute path of the endpoint from ```/```. 

* ```objectserver``` (read-only) - the ```ObjectServer``` to which this endpoint belongs

* ```endpoints``` - an set of child ```Endpoint``` definitions. This is an object whose keys are path string and values are instances of ```Endpoint```. Each path key will be interpreted as relative to this ```Endpoint```s ```path``` property. 

Operations
----------

Each endpoint can implement one or more operations representing each of the HTTP methods: ```GET```, ```PUT```, ```POST```, ```DELETE```, ```CREATE```, ```HEAD```, ```OPTIONS```. There is no requirement an endpoint implement all HTTP methods. It only needs to implement those it wishes to support.

For each HTTP method, an enpoint can choose to implement either an asynchronous or a synchronous operation for that method (but not both for the same method). 

### Asynchronous operations

Asynchronous operations begin with an ```_``` and are implemented by the ```_get```, ```_put```, ```_post```, ```_delete```, ```_create```, ```_head```, ```_options``` class methods. 

Asynchronous operations provide direct access to the raw ```HttpRequest``` and ```HttpResponse``` objects and should be used when low-level manipulation of these objects are required or the endpoint author wishes to use an asynchronous style. Implementing an operation using the asynchronous interface is slightly more work than implementing the equivalent synchronous interface and requires more manual handling of errors. 

Each asynchronous operation is represented as either:
* A function of the form ```function(req, res)```
* An ```Operation``` object. This is more elaborate definition which allows for a description, parameter definitions, and other useful meta-data as well as a ```service``` method of the form ```function(req, res)```

When implementing an an asynchronous endpoint the response object is used directly to return a response to the client.

**Examples**
```node
_get: function(req, res) {
  res.send({ msg: "hello world!" })  
}
```

```node
_get: {
  description: "My hello world operation",
  params: {}
  service: function(req, res) {
    res.send({ msg: "hello world!" })  
  }
}
```

*XXX come back to talk about error handling*

### Synchronous operations

Synchronous operations are implemented by the ```get```, ```put```, ```post```, ```delete```, ```create```, ```head```, ```options``` class methods. 

Synchronous operations provide a higher-level synchronous interface for implementing HTTP methods. The synchronous operations present a more convenient but more restrictive interface, as you do not have direct access to the underlying ```HttpRequest``` and ```HttpResponse``` objects. 

**Examples**
```node
get: function(params) {
  return { msg: "hello world!" }
}
```

```node
get: {
  description: "My hello world operation",
  params: {}
  service: function(params) {
    return { msg: "hello world!" }
  }
}
```

*XXX come back to talk about error handling*

### Operation details

#### _get
Implementation of HTTP ```GET```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 

#### _put
Implementation of HTTP ```PUT```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 

#### _post
Implementation of HTTP ```POST```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### _delete
Implementation of HTTP ```DELETE```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### _create
Implementation of HTTP ```CREATE```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.
  
#### _head
Implementation of HTTP ```HEAD```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 
  
If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### _options
Implementation of HTTP ```OPTIONS```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### get
Synchronous implementation of HTTP ```GET```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```params```: an ```Object``` containing all path and query parameters

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### put
Synchronous implementation of HTTP ```PUT```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```obj```: the JSON object contained in the body of this HTTP request
  * ```params```: an ```Object``` containing all path and query parameters

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### post
Synchronous implementation of HTTP ```POST```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```obj```: the JSON object contained in the body of this HTTP request
  * ```params```: an ```Object``` containing all path and query parameters
  
#### delete
Synchronous implementation of HTTP ```DELETE```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```params```: an ```Object``` containing all path and query parameters

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### create
Synchronous implementation of HTTP ```CREATE```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```params```: an ```Object``` containing all path and query parameters

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### head
Synchronous implementation of HTTP ```HEAD```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * ```params```: an ```Object``` containing all path and query parameters

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.

#### options
Synchronous implementation of HTTP ```OPTIONS```. Either a ```function``` or an ```Operation``` object. 

If the operation is defined by a function it will have these parameters:
  * *none*

If the operation is defined by an ```Operation``` object the definition will have a ```service``` method of the same signature.


Examples
----------

```node
var o = require('maker').o(module)

o({
  _type: 'datanode/ObjectServer',
  
  port: 8888,
  dbUri: 'mongodb://localhost:27017/mydb',
  endpoints: {
    hello: {
      _type: 'datanode/Endpoint',
      get: function(req, res) {
        res.send({msg: "hello world!"})  
      }
    }
  ]
})

```


