class ObjectServer
----------

The ```ObjectServer``` class is the top-level class for defining APIs. 

```
{
  _type: 'datanode/ObjectServer',
  port: <int>,
  description: <string>,
  dbUri: <string>,
  apiRootPath: <string>,
  authenticator: <Authenticator>,
  endpoints: {
    <string>: <Endpoint>,
    ...
}
```

Properties
----------

* ```port``` - the port to listen on

* ```description``` - a short description of this API

* ```dbUri``` - the URI for the database (e.g.: ```'mongodb://localhost:27017/mydb' ```). The server will connect to this database at startup and expose it through the ```db``` property

* ```apiRootPath``` - the root URL path for this API. All HTTP requests must use this prefix to reach the endpoints of this API. This value defaults to the empty string ```''```

* ```authenticator``` - the ```Authenticator``` object for this API. The authenticator is used to authenticate the API user

* ```endpoints``` - an set of ```Endpoint``` definitions used to define the endpoints that comprise this API. This is an object whose keys are path string and values are instances of ```Endpoint```. Each path key will be interpreted as relative to this ```ObjectServer```s ```apiRootPath``` property. These paths can also define variable bindings (e.g. ```orders/:id```)  

Methods
----------

###start

#### start

```start(options, cb)```


```start(options, cb)```


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


