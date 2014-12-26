class Endpoint
----------

The ```Endpoint``` class. 

Configuration
----------

```
{
  path: <string>,
  endpoints: <Endpoint>
}
```

Properties
----------

* ```path``` - the path to which this endpoint is bound. The path can contain variable patterns such as ```/orders/:id```.

* ```objectserver``` (read-only) - the ```ObjectServer``` of which this endpoint is a part

* ```endpoints``` - an array of child ```Endpoint``` objects (XXX explain more)

Methods
----------

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


