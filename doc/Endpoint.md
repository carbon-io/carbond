class Endpoint
----------

An ```Endpoint``` is a representation of a RESTFul resource. Each endpoint can implement one or more operations representing each of the HTTP methods: ```GET, PUT, POST, DELETE, CREATE, HEAD, OPTIONS```. 

Endpoints can also define child endpoints whose paths will be interpreted relative to the ```path``` of this ```Endpoint``` object.

Configuration
----------

```
{
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

* ```path``` (read-only) - the path to which this endpoint is bound. The path can contain variable patterns such as ```orders/:id```. The ```path``` property is not configured directly on ```Endpoint``` objects but are specified as lvals in enclosing defininitions of endpoints such as in an ```ObjectServer``` or a parent ```Endpoint``` object. When retrieved the value of this property will be the absolute path of the endpoint from ```/```. 

* ```objectserver``` (read-only) - the ```ObjectServer``` of which this endpoint is a part

* ```endpoints``` - an array of child ```Endpoint``` objects (XXX explain more)

Operations
----------

Each endpoint can implement one or more operations representing each of the HTTP methods: ```GET, PUT, POST, DELETE, CREATE, HEAD, OPTIONS```. 

Each operation is represented as either:
* A function of the form ```function(req, res)```
* An ```Operation``` object. This is more elaborate definition which allows for a description, parameter definitions, and other useful meta-data as well as a ```service``` function of the form ```function(req, res)```

#### get
#### put
#### post
#### delete
#### options
#### head

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


