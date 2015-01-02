class Endpoint
----------

An ```Endpoint``` is a representation of a RESTFul resource. Each endpoint can implement one or more operations representing each of the HTTP methods: ```GET, PUT, POST, DELETE, CREATE, HEAD, OPTIONS```. 

Endpoints can also define child endpoints whose paths will be interpreted relative to the ```path``` of this ```Endpoint``` object.

Configuration
----------

```
{
  _type: 'datanode/Endpoint',
  [get: <function> | <Operation>],
  [put: <function> | <Operation>],
  [post: <function> | <Operation>],
  [delete: <function> | <Operation>],
  [create: <function> | <Operation>],
  [head: <function> | <Operation>],
  [options: <function> | <Operation>],
  endpoints: { 
    <string>: <Endpoint>
    ...
  }
}
```

Properties
----------

* ```path``` (read-only) - the path to which this endpoint is bound. The path can contain variable patterns such (e.g. ```'orders/:id'```). The ```path``` property is not configured directly on ```Endpoint``` objects but are specified as lvals in enclosing defininitions of endpoints such as in an ```ObjectServer``` or a parent ```Endpoint``` object. When retrieved the value of this property will be the absolute path of the endpoint from ```/```. 

* ```objectserver``` (read-only) - the ```ObjectServer``` to which this endpoint belongs

* ```endpoints``` - an set of child ```Endpoint``` definitions. This is an object whose keys are path string and values are instances of ```Endpoint```. Each path key will be interpreted as relative to this ```Endpoint```s ```path``` property. 

Operations
----------

Each endpoint can implement one or more operations representing each of the HTTP methods: ```GET, PUT, POST, DELETE, CREATE, HEAD, OPTIONS```. 

Each operation is represented as either:
* A function of the form ```function(req, res)```
* An ```Operation``` object. This is more elaborate definition which allows for a description, parameter definitions, and other useful meta-data as well as a ```service``` method of the form ```function(req, res)```

#### get
Implementation of HTTP ```GET```. Either a ```function``` or an ```Operation``` object. If a function it will have the parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 

#### put
Implementation of HTTP ```PUT```. Either a ```function``` or an ```Operation``` object. If a function it will have the parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 
  
#### post
Implementation of HTTP ```POST```. Either a ```function``` or an ```Operation``` object. If a function it will have the parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 
  
#### delete
Implementation of HTTP ```DELETE```. Either a ```function``` or an ```Operation``` object. If a function it will have the parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 

#### create (proposed)
Implementation of HTTP ```CREATE```. Either a ```function``` or an ```Operation``` object. If a function it will have the parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 
  
#### head
Implementation of HTTP ```HEAD```. Either a ```function``` or an ```Operation``` object. If a function it will have the parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 
  
#### options
Implementation of HTTP ```OPTIONS```. Either a ```function``` or an ```Operation``` object. If a function it will have the parameters:
  * ```req```: the ```HttpRequest``` object
  * ```res```: the ```HttpResponse``` object 
  

Example
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


