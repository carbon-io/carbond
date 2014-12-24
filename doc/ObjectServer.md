class ObjectServer
----------

The ```ObjectServer``` class is the top-level class for defining APIs. 

```
{
  port: <int>,
  description: <string>,
  dbUri: <string>,
  apiRootPath: <string>,
  authenticator: <Authenticator>,
  endpoints: [<Endpoint>],
}
```

Properties
----------

* ```port``` - the port to listen on
* ```description``` - a short description of this API
* ```dbUri```: - the URI for the database (e.g.: ```'mongodb://localhost:27017/mydb' ```)
* ```apiRootPath```: 

Methods
----------

Example
----------

```node
o({
  _type: 'datanode/ObjectServer',
  
  port: 8888,
  dbUri: 'mongodb://localhost:27101/mydb',
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


